import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';

import { LayoutActionType } from './layout-action.type';
import { LayoutState } from './layout.state';
import { layoutSelectors } from './layout.selectors';

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
    { dispatch: false },
  );

  public constructor(
    private actions$: Actions,
    private translateService: TranslateService,
    private localStorageService: LocalStorageService,
    private layoutStore: Store<LayoutState>,
  ) { }
}
