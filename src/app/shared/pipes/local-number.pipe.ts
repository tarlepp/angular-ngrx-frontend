import { formatNumber } from '@angular/common';
import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Locale } from 'src/app/shared/enums';
import { layoutSelectors } from 'src/app/store/store-selectors';
import { LayoutState } from 'src/app/store/store-states';

/**
 * Locale aware number pipe that uses Angular internal `DecimalPipe` implementation
 * within application user specified locale.
 *
 * Usage;
 *  {{ someNumber | localNumber [ : digitsInfo [ : locale ] ] }}
 *
 * This pipes accepts the same pipe arguments than Angular original `DecimalPipe`
 * implementation, the only main difference is that user locale is used automatically,
 * if you don't pass that to this `localNumber` pipe as you would with that Angular
 * core pipe.
 *
 * Note that this pipe isn't `pure` one, because otherwise we cannot get those
 * locale changes to work as expected. And this might cause some performance issues
 * - or not dunno.
 */
@Pipe({
  name: 'localNumber',
  pure: false,
})
export class LocalNumberPipe implements PipeTransform, OnDestroy {
  private locale: Locale;
  private subscriptions: Subscription;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(private layoutStore: Store<LayoutState>) {
    this.subscriptions = new Subscription();

    // Subscribe to locale changes
    this.subscriptions
      .add(this.layoutStore
        .select(layoutSelectors.locale)
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
   */
  public transform(value: any, format?: string, locale?: string): string {
    return value === undefined || value === null || value === ''
      ? ''
      : formatNumber(value, locale || this.locale, format);
  }
}
