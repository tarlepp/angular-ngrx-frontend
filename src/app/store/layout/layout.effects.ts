import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, of } from 'rxjs';
import { map, pluck, switchMap, withLatestFrom } from 'rxjs/operators';

import { LayoutAction } from './layout.action';
import { LayoutState } from './layout.state';
import { layoutSelectors } from './layout.selectors';
import { layoutActions } from './layout.actions';

@Injectable()
export class LayoutEffects {
  // noinspection JSUnusedLocalSymbols
  private changeLanguage$ = createEffect((): Observable<void> => this.actions$
      .pipe(
        ofType(LayoutAction.CHANGE_LANGUAGE),
        withLatestFrom(this.layoutStore.select(layoutSelectors.language)),
        map(([, language]): void => {
          this.translateService.use(language);
          this.localStorageService.store('language', language);
        }),
      ),
    { dispatch: false },
  );

  // noinspection JSUnusedLocalSymbols
  private scrollToTop$ = createEffect((): Observable<TypedAction<LayoutAction.SCROLL_TO>> => this.actions$
    .pipe(
      ofType(LayoutAction.SCROLL_TO_TOP),
      switchMap((): Observable<TypedAction<LayoutAction.SCROLL_TO>> => of(layoutActions.scrollTo({anchor: '#top-page'}))),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  private scrollTo$ = createEffect((): Observable<TypedAction<LayoutAction.SCROLL_TO_CLEAR>> => this.actions$
    .pipe(
      ofType(LayoutAction.SCROLL_TO),
      pluck('anchor'),
      switchMap((anchor: string): Observable<TypedAction<LayoutAction.SCROLL_TO_CLEAR>> => {
        setTimeout((): void => {
          const element = document.querySelector(anchor);

          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        });

        return of(layoutActions.scrollToClear());
      }),
    ),
  );

  public constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private layoutStore: Store<LayoutState>,
  ) { }
}
