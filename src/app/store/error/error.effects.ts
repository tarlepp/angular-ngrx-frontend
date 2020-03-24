import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { SnackbarService } from 'src/app/shared/services';
import { ErrorAction } from 'src/app/store/store.action';

@Injectable()
export class ErrorEffects {
  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect that is triggered within `ErrorAction.SNACKBAR` action.
   * This effect will call `SnackbarService` to create snackbar message
   * about specified error.
   *
   * Within this effect we won't dispatch any other store actions.
   */
  private snackbarError$: Observable<void> = createEffect((): Observable<void> =>
    this.actions$.pipe(
      ofType(ErrorAction.SNACKBAR),
      pluck('error'),
      map((error: ServerErrorInterface): void => {
        this.snackbarService
          .error(error)
          .finally();
      }),
    ),
    { dispatch: false },
  );

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(private actions$: Actions, private snackbarService: SnackbarService) { }
}
