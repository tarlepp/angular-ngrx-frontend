import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, of } from 'rxjs';
import { map, pluck, switchMap, withLatestFrom } from 'rxjs/operators';

import { LayoutActionType } from './layout-action.type';
import { LayoutState } from './layout.state';
import { layoutSelectors } from './layout.selectors';
import { layoutActions } from './layout.actions';

@Injectable()
export class LayoutEffects {
  private changeLanguage$ = createEffect((): Observable<void> => this.actions$
      .pipe(
        ofType(LayoutActionType.CHANGE_LANGUAGE),
        withLatestFrom(this.layoutStore.pipe(select(layoutSelectors.language))),
        map(([, language]): void => {
          this.translateService.use(language);
          this.localStorageService.store('language', language);
        }),
      ),
    {dispatch: false},
  );

  private scrollToTop$ = createEffect((): Observable<TypedAction<LayoutActionType.SCROLL_TO>> => this.actions$
    .pipe(
      ofType(LayoutActionType.SCROLL_TO_TOP),
      switchMap((): Observable<TypedAction<LayoutActionType.SCROLL_TO>> => of(layoutActions.scrollTo({anchor: '#top-page'}))),
    ),
  );

  private scrollTo$ = createEffect((): Observable<void> => this.actions$
    .pipe(
      ofType(LayoutActionType.SCROLL_TO),
      pluck('anchor'),
      map((anchor: string): void => {
        setTimeout((): void => {
          const element = document.querySelector(anchor);

          if (element) {
            element.scrollIntoView({behavior: 'smooth'});
          }
        })
      }),
    ),
    {dispatch: false},
  );

  public constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private layoutStore: Store<LayoutState>,
  ) { }
}
