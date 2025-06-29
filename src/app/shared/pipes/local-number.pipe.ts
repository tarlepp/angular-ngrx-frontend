import { formatNumber } from '@angular/common';
import { OnDestroy, Pipe, PipeTransform, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Locale } from 'src/app/shared/enums';
import { layoutSelectors } from 'src/app/store';

/**
 * Locale aware number pipe that uses Angular internal `DecimalPipe` implementation
 * within application user specified locale.
 *
 * Usage;
 *  {{ someNumber | localNumber [ : digitsInfo [ : locale ] ] }}
 *
 * This pipes accepts the same pipe arguments than Angular original `DecimalPipe`
 * implementation, the only main difference is that user locale is used automatically,
 * if you don't pass that to this `localNumber` pipe as you would with that Angular
 * core pipe.
 *
 * Note that this pipe isn't `pure` one, because otherwise we cannot get those
 * possible locale changes to work as expected. Internally this pipe is using
 * local cache, so that we don't do fire unnecessary function calls on every
 * change-detection cycle.
 */
@Pipe({
  name: 'localNumber',
  pure: false,
})
export class LocalNumberPipe implements PipeTransform, OnDestroy {
  private locale: Locale = Locale.DEFAULT;
  private cachedLocale: Locale = Locale.DEFAULT;
  private cachedOutput: string|null = null;

  private readonly store: Store = inject(Store);
  private readonly subscriptions: Subscription = new Subscription();

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor() {
    // Subscribe to locale changes
    this.subscriptions
      .add(this.store
        .select(layoutSelectors.selectLocale)
        .subscribe((locale: Locale): Locale => this.locale = locale),
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
   * Note that we use local cache here, so that we don't fire function calls on
   * every change-detection cycle.
   */
  public transform(value: number|string|null, format?: string, locale?: string): string {
    const currentLocale = locale as Locale || this.locale;

    if (this.cachedOutput === null || currentLocale !== this.cachedLocale) {
      this.cachedLocale = currentLocale;

      this.cachedOutput = value !== null && Number.isFinite(+value) ? formatNumber(+value, currentLocale, format) : '';
    }

    return this.cachedOutput;
  }
}
