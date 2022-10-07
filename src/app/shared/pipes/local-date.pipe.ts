import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { Subscription } from 'rxjs';

import { Locale } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';
import { layoutSelectors } from 'src/app/store';

/**
 * Locale and timezone aware date formatter pipe that can be used shorthand
 * version instead of using multiple `am*` pipes.
 *
 * Usage;
 *  {{ '1982-10-12T15:59:11+00:00' | localDate : 'LLLL' }}
 *
 * See documentation about available tokens:
 *  - https://moment.github.io/luxon/#/formatting?id=table-of-tokens
 *
 * Note that this pipe isn't `pure` one, because otherwise we cannot get those
 * possible locale / timezone changes to work as expected. Internally this pipe
 * is using local cache, so that we don't do fire unnecessary moment function
 * calls on every change-detection cycle.
 */
@Pipe({
  name: 'localDate',
  pure: false,
})
export class LocalDatePipe implements PipeTransform, OnDestroy {
  private locale: Locale;
  private timezone: string;
  private cachedLocale: Locale;
  private cachedTimezone: string;
  private cachedOutput: string|null;
  private readonly subscriptions: Subscription;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private readonly store: Store,
  ) {
    this.locale = Locale.DEFAULT;
    this.timezone = 'Europe/Helsinki';
    this.cachedLocale = Locale.DEFAULT;
    this.cachedTimezone = 'Europe/Helsinki';
    this.cachedOutput = null;
    this.subscriptions = new Subscription();

    // Subscribe to localization changes
    this.subscriptions
      .add(this.store
        .select(layoutSelectors.selectLocalization)
        .subscribe((localization: LocalizationInterface): void => {
          this.locale = localization.locale;
          this.timezone = localization.timezone;
        }),
      );
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * before a directive, pipe, or service instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Angular invokes the `transform` method with the value of a binding as the
   * first argument, and any parameters as the second argument in list form.
   *
   * Note that we use local cache here, so that we don't fire those moment
   * library function calls on every change-detection cycle.
   */
  public transform(value: string|Date, format?: string): string {
    if (this.cachedOutput === null || this.cachedLocale !== this.locale || this.cachedTimezone !== this.timezone) {
      this.cachedLocale = this.locale;
      this.cachedTimezone = this.timezone;

      //this.cachedOutput = moment(value).tz(this.timezone).locale(this.locale).format(format || 'x').toString();

      this.cachedOutput = DateTime
        .fromISO(value instanceof Date ? value.toDateString() : value)
        .setZone(this.timezone)
        .setLocale(this.locale)
        .toFormat(format || 'F');
    }

    return this.cachedOutput;
  }
}
