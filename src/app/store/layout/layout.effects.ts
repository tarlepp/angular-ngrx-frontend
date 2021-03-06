import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment-timezone';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck, tap, withLatestFrom } from 'rxjs/operators';

import { Language, Locale, Theme } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';
import { layoutActions, layoutSelectors, LayoutType, LocalizationTypes } from 'src/app/store';

@Injectable()
export class LayoutEffects {
  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.updateLocalization` action, within this
   * we area actually switching this original action observable to multiple
   * new action observables which are making following;
   *  1) Change language.
   *  2) Change locale.
   *  3) Change timezone.
   *
   * Each of these actions you can find from this effect class.
   */
  private updateLocalization$: Observable<TypedAction<LocalizationTypes>> = createEffect(
    (): Observable<TypedAction<LocalizationTypes>> => this.actions$.pipe(
      ofType(layoutActions.updateLocalization),
      pluck('localization'),
      mergeMap((localization: LocalizationInterface): Array<TypedAction<LocalizationTypes>> => [
        layoutActions.changeLanguage({ language: localization.language }),
        layoutActions.changeLocale({ locale: localization.locale }),
        layoutActions.changeTimezone({ timezone: localization.timezone }),
      ]),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.changeLanguage` action, which will do
   * following jobs;
   *  1) Change the language within translate service, this will trigger
   *     application to change all translations to match this new language.
   *  2) Store new language to local storage, so that if user refresh the
   *     page he/she will get the same language that he/she earlier chose.
   *
   * Within this effect we won't dispatch any other store actions.
   */
  private changeLanguage$: Observable<void> = createEffect(
    (): Observable<void> => this.actions$.pipe(
      ofType(layoutActions.changeLanguage),
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
   * NgRx effect for `layoutActions.changeLocale` action, which will do
   * following jobs;
   *  1) Change moment.js library locale setting, this will affect to shown
   *     time, date and datetime values in application that are formatted by
   *     this library.
   *  2) Store new locale to local storage, so that if user refresh the
   *     page he/she will get the same locale that he/she earlier chose.
   *
   * Within this effect we won't dispatch any other store actions.
   */
  private changeLocale$: Observable<void> = createEffect(
    (): Observable<void> => this.actions$.pipe(
      ofType(layoutActions.changeLocale),
      pluck('locale'),
      map((locale: Locale): void => {
        moment.locale(locale);

        this.localStorageService.store('locale', locale);
      }),
    ),
    { dispatch: false },
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.changeTimezone` action, which will do
   * following jobs;
   *  1) Change moment.js library default timezone setting, this will affect
   *     to shown time, date and datetime values in application that are
   *     formatted by this library.
   *  2) Store new timezone to local storage, so that if user refresh the
   *     page he/she will get the same timezone that he/she earlier chose.
   *
   * Within this effect we won't dispatch any other store actions.
   */
  private changeTimezone$: Observable<void> = createEffect(
    (): Observable<void> => this.actions$.pipe(
      ofType(layoutActions.changeTimezone),
      pluck('timezone'),
      map((timezone: string): void => {
        moment.tz.setDefault(timezone);

        this.localStorageService.store('timezone', timezone);
      }),
    ),
    { dispatch: false },
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.scrollToTop` action, purpose of this is to
   * make user browser to scroll to top of the page.
   *
   * Within this event we just switch that original action observable to common
   * `LayoutAction.SCROLL_TO` action which effect will actually do that scroll
   * in browser.
   */
  private scrollToTop$: Observable<TypedAction<LayoutType.SCROLL_TO>> = createEffect(
    (): Observable<TypedAction<LayoutType.SCROLL_TO>> => this.actions$.pipe(
      ofType(layoutActions.scrollToTop),
      map((): TypedAction<LayoutType.SCROLL_TO> => layoutActions.scrollTo({ anchor: '#top-page' })),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.scrollTo` action, purpose of this action is
   * to scroll user browser to specified HTML anchor and after that switch that
   * original action observable to `LayoutAction.CLEAR_SCROLL_TO` which clear
   * that scroll to state in layout store.
   */
  private scrollTo$: Observable<TypedAction<LayoutType.CLEAR_SCROLL_TO>> = createEffect(
    (): Observable<TypedAction<LayoutType.CLEAR_SCROLL_TO>> => this.actions$.pipe(
      ofType(layoutActions.scrollTo),
      pluck('anchor'),
      tap((anchor: string): void => {
        setTimeout((): void => {
          const element = document.querySelector(anchor);

          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }),
      map((): TypedAction<LayoutType.CLEAR_SCROLL_TO> => layoutActions.clearScrollTo()),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.toggleTheme` action, purpose of this is to
   * toggle current theme and dispatch another action to set that toggled
   * theme, where actual domain logic is done.
   */
  private toggleTheme$: Observable<TypedAction<LayoutType.SET_THEME>> = createEffect(
    (): Observable<TypedAction<LayoutType.SET_THEME>> => this.actions$.pipe(
      ofType(layoutActions.toggleTheme),
      withLatestFrom(this.store.select(layoutSelectors.theme)),
      map(([, theme]: [any, Theme]): Theme => theme === Theme.DARK ? Theme.LIGHT : Theme.DARK),
      map((theme: Theme): TypedAction<LayoutType.SET_THEME> => layoutActions.setTheme({ theme })),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.setTheme` action, purpose of this is to set
   * current theme as active in DOM perspective. This is done simple as just
   * removing and adding theme named CSS class to applications `body` element.
   */
  private setTheme$: Observable<void> = createEffect(
    (): Observable<void> => this.actions$.pipe(
      ofType(layoutActions.setTheme),
      pluck('theme'),
      map((theme: Theme): void => {
        const body = document.getElementsByTagName('body')[0];

        if (body.classList.contains(theme) === false) {
          body.classList.remove(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
          body.classList.add(theme);
        }
      }),
    ),
    { dispatch: false },
  );

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private store: Store,
  ) { }
}
