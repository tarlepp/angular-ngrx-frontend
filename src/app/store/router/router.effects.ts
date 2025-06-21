import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LayoutType, layoutActions } from 'src/app/store';

@Injectable()
export class RouterEffects {
  private readonly actions$: Actions = inject(Actions);

  // noinspection JSUnusedLocalSymbols
  /**
   * Each time `NavigationEnd` event is dispatched from router, we want to
   * scroll browser to top of the page. This basically happens each time user
   * navigates to another route within this application.
   */
  private routerNavigatedActionEffect$: Observable<Action<LayoutType.SCROLL_TO_TOP>> = createEffect(
    (): Observable<Action<LayoutType.SCROLL_TO_TOP>> => this.actions$.pipe(
      ofType(routerNavigatedAction),
      map((): Action<LayoutType.SCROLL_TO_TOP> => layoutActions.scrollToTop()),
    ),
  );
}
