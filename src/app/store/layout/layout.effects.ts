import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment-timezone';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';

import { Language, Locale } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';
import { layoutActions } from 'src/app/store/store-actions';
import { LocalizationTypes } from 'src/app/store/store-types';
import { LayoutAction } from 'src/app/store/store.action';

@Injectable()
export class LayoutEffects {
  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `LayoutAction.UPDATE_LOCALIZATION` action, within this
   * we area actually switching this original action observable to multiple
   * new action observables which are making following;
   *  1) Change language.
   *  2) Change locale.
   *  3) Change timezone.
   *
   * Each of these actions you can find from this effect class.
   */
  private changeLocalization$: Observable<TypedAction<LocalizationTypes>> = createEffect(
    (): Observable<TypedAction<LocalizationTypes>> => this.actions$
    .pipe(
      ofType(LayoutAction.UPDATE_LOCALIZATION),
      pluck('localization'),
      switchMap((localization: LocalizationInterface): Array<TypedAction<LocalizationTypes>> => [
        layoutActions.changeLanguage({ language: localization.language }),
        layoutActions.changeLocale({ locale: localization.locale }),
        layoutActions.changeTimezone({ timezone: localization.timezone }),
      ]),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `LayoutAction.CHANGE_LANGUAGE` action, which will do
   * following jobs;
   *  1) Change the language within translate service, this will trigger
   *     application to change all translations to match this new language.
   *  2) Store new language to local storage, so that if user refresh the
   *     page he/she will get the same language that he/she earlier chose.
   *
   * Within this effect we won't dispatch any other store actions.
   */
  private changeLanguage$: Observable<void> = createEffect((): Observable<void> => this.actions$
      .pipe(
        ofType(LayoutAction.CHANGE_LANGUAGE),
        pluck('language'),
        map((language: Language): void => {
          this.translateService.use(language);
          this.localStorageService.store('language', language);
        }),
      ),
    { dispatch: false },
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `LayoutAction.CHANGE_LOCALE` action, which will do
   * following jobs;
   *  1) Change moment.js library locale setting, this will affect to shown
   *     time, date and datetime values in application that are formatted by
   *     this library.
   *  2) TODO:
   *     Store new language to local storage, so that if user refresh the
   *     page he/she will get the same locale that he/she earlier chose.
   *
   * Within this effect we won't dispatch any other store actions.
   */
  private changeLocale$: Observable<void> = createEffect((): Observable<void> => this.actions$
    .pipe(
      ofType(LayoutAction.CHANGE_LOCALE),
      pluck('locale'),
      map((locale: Locale): void => moment.locale(locale)),
    ),
    { dispatch: false },
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `LayoutAction.CHANGE_TIMEZONE` action, which will do
   * following jobs;
   *  1) Change moment.js library default timezone setting, this will affect
   *     to shown time, date and datetime values in application that are
   *     formatted by this library.
   *  2) TODO:
   *     Store new timezone to local storage, so that if user refresh the
   *     page he/she will get the same timezone that he/she earlier chose.
   *
   * Within this effect we won't dispatch any other store actions.
   */
  private changeTimezone$: Observable<void> = createEffect((): Observable<void> => this.actions$
    .pipe(
      ofType(LayoutAction.CHANGE_TIMEZONE),
      pluck('timezone'),
      map((timezone: string): void => moment.tz.setDefault(timezone)),
    ),
    { dispatch: false },
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `LayoutAction.SCROLL_TO_TOP` action, purpose of this is to
   * make user browser to scroll to top of the page.
   *
   * Within this event we just switch that original action observable to common
   * `LayoutAction.SCROLL_TO` action which effect will actually do that scroll
   * in browser.
   */
  private scrollToTop$: Observable<TypedAction<LayoutAction.SCROLL_TO>> = createEffect(
    (): Observable<TypedAction<LayoutAction.SCROLL_TO>> => this.actions$
    .pipe(
      ofType(LayoutAction.SCROLL_TO_TOP),
      switchMap((): Observable<TypedAction<LayoutAction.SCROLL_TO>> => of(layoutActions.scrollTo({ anchor: '#top-page' }))),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `LayoutAction.SCROLL_TO` action, purpose of this action is
   * to scroll user browser to specified HTML anchor and after that switch that
   * original action observable to `LayoutAction.CLEAR_SCROLL_TO` which clear
   * that scroll to state in layout store.
   */
  private scrollTo$: Observable<TypedAction<LayoutAction.CLEAR_SCROLL_TO>> = createEffect(
    (): Observable<TypedAction<LayoutAction.CLEAR_SCROLL_TO>> => this.actions$
    .pipe(
      ofType(LayoutAction.SCROLL_TO),
      pluck('anchor'),
      switchMap((anchor: string): Observable<TypedAction<LayoutAction.CLEAR_SCROLL_TO>> => {
        setTimeout((): void => {
          const element = document.querySelector(anchor);

          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        });

        return of(layoutActions.clearScrollTo());
      }),
    ),
  );

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
  ) { }
}
