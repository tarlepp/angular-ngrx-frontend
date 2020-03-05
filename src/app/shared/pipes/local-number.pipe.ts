import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Locale } from 'src/app/shared/enums';
import { LayoutState } from 'src/app/store/store-states';
import { layoutSelectors } from 'src/app/store/store-selectors';

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

  public constructor(private layoutStore: Store<LayoutState>) {
    this.subscriptions = new Subscription();

    this.subscriptions
      .add(this.layoutStore
        .select(layoutSelectors.locale)
        .subscribe((locale: Locale): Locale => this.locale = locale),
      );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public transform(value: any, format?: string, locale?: string): string {
    return value === undefined || value === null || value === ''
      ? ''
      : formatNumber(value, locale || this.locale, format);
  }
}
