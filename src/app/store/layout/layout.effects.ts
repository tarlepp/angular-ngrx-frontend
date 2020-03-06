import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, of } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import * as moment from 'moment-timezone';

import { LayoutAction } from 'src/app/store/store.action';
import { layoutActions } from 'src/app/store/store-actions';
import { LocalizationTypes } from 'src/app/store/store-types';
import { LocalizationInterface } from 'src/app/shared/interfaces';
import { Language, Locale } from 'src/app/shared/enums';

@Injectable()
export class LayoutEffects {
  // noinspection JSUnusedLocalSymbols
  private changeLocalization$ = createEffect((): Observable<TypedAction<LocalizationTypes>> => this.actions$
    .pipe(
      ofType(LayoutAction.UPDATE_LOCALIZATION),
      pluck('localization'),
      switchMap((localization: LocalizationInterface) => [
        layoutActions.changeLanguage({ language: localization.language }),
        layoutActions.changeLocale({ locale: localization.locale }),
        layoutActions.changeTimezone({ timezone: localization.timezone }),
      ]),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  private changeLanguage$ = createEffect((): Observable<void> => this.actions$
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
  private changeLocale$ = createEffect((): Observable<void> => this.actions$
    .pipe(
      ofType(LayoutAction.CHANGE_LOCALE),
      pluck('locale'),
      map((locale: Locale): void => moment.locale(locale)),
    ),
    { dispatch: false },
  );

  // noinspection JSUnusedLocalSymbols
  private changeTimezone$ = createEffect((): Observable<void> => this.actions$
    .pipe(
      ofType(LayoutAction.CHANGE_TIMEZONE),
      pluck('timezone'),
      map((timezone: string): void => moment.tz.setDefault(timezone)),
    ),
    { dispatch: false },
  );

  // noinspection JSUnusedLocalSymbols
  private scrollToTop$ = createEffect((): Observable<TypedAction<LayoutAction.SCROLL_TO>> => this.actions$
    .pipe(
      ofType(LayoutAction.SCROLL_TO_TOP),
      switchMap((): Observable<TypedAction<LayoutAction.SCROLL_TO>> => of(layoutActions.scrollTo({ anchor: '#top-page' }))),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  private scrollTo$ = createEffect((): Observable<TypedAction<LayoutAction.CLEAR_SCROLL_TO>> => this.actions$
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

  public constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
  ) { }
}
