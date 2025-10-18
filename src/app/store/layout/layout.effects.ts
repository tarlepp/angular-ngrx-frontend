import { Injectable, DOCUMENT, inject } from '@angular/core';
import { MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Settings } from 'luxon';
import { noop, Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

import { Language, Locale, Theme } from 'src/app/shared/enums';
import { DictionaryInterface, LocalizationInterface } from 'src/app/shared/interfaces';
import { SnackbarService } from 'src/app/shared/services';
import { layoutActions, LayoutType, LocalizationTypes } from 'src/app/store';

@Injectable()
export class LayoutEffects {
  private readonly document: Document = inject<Document>(DOCUMENT);
  private readonly actions$: Actions = inject(Actions);
  private readonly translocoService: TranslocoService = inject(TranslocoService);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.updateLocalization` action, within this
   * we are actually switching this original action observable to multiple
   * new action observables which are making following;
   *  1) Change language.
   *  2) Change locale.
   *  3) Change timezone.
   *
   * Each of these actions you can find from this effect class.
   */
  private updateLocalizationEffect$: Observable<Action<LocalizationTypes>> = createEffect(
    (): Observable<Action<LocalizationTypes>> => this.actions$.pipe(
      ofType(layoutActions.updateLocalization),
      map((action): LocalizationInterface => action.localization),
      mergeMap((localization: LocalizationInterface): Array<Action<LocalizationTypes>> => [
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
   *  1) Change HTML element `lang` attribute to match new language.
   *  2) Change the language within translate service, this will trigger
   *     application to change all translations to match this new language.
   *  3) Dispatch new action to actually set language to layout feature store
   *     after language is loaded to application.
   */
  private changeLanguageEffect$: Observable<Action<LayoutType.SET_LANGUAGE>> = createEffect(
    (): Observable<Action<LayoutType.SET_LANGUAGE>> => this.actions$.pipe(
      ofType(layoutActions.changeLanguage),
      map((action): Language => action.language),
      tap((language: Language): Language => this.document.documentElement.lang = language),
      tap((language: Language): TranslocoService => this.translocoService.setActiveLang(language as string)),
      map((): Action<LayoutType.SET_LANGUAGE> =>
        layoutActions.setLanguage({ language: this.translocoService.getActiveLang() as Language }),
      ),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.changeLocale` action, which will do
   * following jobs;
   *  1) Change Luxon library locale setting, this will affect to shown
   *     time, date and datetime values in application that are formatted by
   *     this library.
   *  2) Store new locale to local storage, so that if user refresh the
   *     page he/she will get the same locale that he/she earlier chose.
   *
   * Within this effect we won't dispatch any other store actions.
   */
  private changeLocaleEffect$: Observable<Locale> = createEffect(
    (): Observable<Locale> => this.actions$.pipe(
      ofType(layoutActions.changeLocale),
      map((action): Locale => action.locale),
      map((locale: Locale): Locale => Settings.defaultLocale = locale),
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
  private changeTimezoneEffect$: Observable<string> = createEffect(
    (): Observable<string> => this.actions$.pipe(
      ofType(layoutActions.changeTimezone),
      map((action): string => action.timezone),
      map((timezone: string): string => Settings.defaultZone = timezone),
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
  private scrollToTopEffect$: Observable<Action<LayoutType.SCROLL_TO>> = createEffect(
    (): Observable<Action<LayoutType.SCROLL_TO>> => this.actions$.pipe(
      ofType(layoutActions.scrollToTop),
      map((): Action<LayoutType.SCROLL_TO> => layoutActions.scrollTo({ anchor: '#top-page' })),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.scrollTo` action, purpose of this action is
   * to scroll user browser to specified HTML anchor and after that switch that
   * original action observable to `LayoutAction.CLEAR_SCROLL_TO` which clear
   * that scroll to state in layout store.
   */
  private scrollToEffect$: Observable<Action<LayoutType.CLEAR_SCROLL_TO>> = createEffect(
    (): Observable<Action<LayoutType.CLEAR_SCROLL_TO>> => this.actions$.pipe(
      ofType(layoutActions.scrollTo),
      tap((payload: { anchor: string, instant?: boolean }): void => {
        setTimeout((): void => {
          const element = this.document.querySelector(payload.anchor);

          if (element) {
            element.scrollIntoView({ behavior: payload.instant ? 'auto' : 'smooth' });
          }
        }, 0);
      }),
      map((): Action<LayoutType.CLEAR_SCROLL_TO> => layoutActions.clearScrollTo()),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.setTheme` action, purpose of this is to set
   * current theme as active in DOM perspective. This is done simple as just
   * removing and adding theme named CSS class to applications `body` element.
   */
  private setThemeEffect$: Observable<void> = createEffect(
    (): Observable<void> => this.actions$.pipe(
      ofType(layoutActions.changeTheme),
      map((action): Theme => action.theme),
      map((theme: Theme): void => {
        const body = this.document.getElementsByTagName('body')[0];

        if (!body.classList.contains(theme)) {
          body.classList.remove(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT);
          body.classList.add(theme);
        }
      }),
    ),
    { dispatch: false },
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `layoutActions.snackbarMessage` action, purpose of this
   * is trigger snackbar with specified message and duration.
   */
  private snackbarMessageEffect$: Observable<void> = createEffect(
    (): Observable<void> => this.actions$.pipe(
      ofType(layoutActions.snackbarMessage),
      tap(
        (payload: { message: string, duration?: number, params?: DictionaryInterface<string> }): Promise<MatSnackBarRef<SimpleSnackBar>> =>
          this.snackbarService.message(payload.message, payload.duration, payload.params).finally(),
      ),
      map((): void => noop()),
    ),
    { dispatch: false },
  );
}
