import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as moment from 'moment-timezone';

import { Locale } from 'src/app/shared/enums';
import { LayoutState } from 'src/app/store/layout/layout.state';
import { layoutSelectors } from 'src/app/store/layout/layout.selectors';
import { LocalizationInterface } from 'src/app/shared/interfaces';

/**
 * Locale and timezone aware date formatter pipe that can be used short hand
 * version instead of using multiple `am*` pipes.
 *
 * Usage;
 *  {{ '1982-10-12T15:59:11+00:00' | localDate : 'LLLL' }}
 *
 * Note that this pipe isn't `pure` one, because otherwise we cannot get those
 * locale changes to work as expected. And this might cause some performance
 * issues - or not - dunno.
 */
@Pipe({
  name: 'localDate',
  pure: false,
})
export class LocalDatePipe implements PipeTransform, OnDestroy {
  private locale: Locale;
  private timezone: string;
  private subscriptions: Subscription;

  public constructor(private layoutStore: Store<LayoutState>) {
    this.subscriptions = new Subscription();

    this.subscriptions
      .add(this.layoutStore
        .select(layoutSelectors.localization)
        .subscribe((localization: LocalizationInterface): void => {
          this.locale = localization.locale;
          this.timezone = localization.timezone;
        }),
      );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public transform(value: string, format?: string): string {
    return moment(value).tz(this.timezone).locale(this.locale).format(format || 'x').toString();
  }
}
