import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { SnackbarService } from 'src/app/shared/services';
import { errorActions } from 'src/app/store';

@Injectable()
export class ErrorEffects {
  private readonly actions$: Actions = inject(Actions);
  private readonly snackbarService: SnackbarService = inject(SnackbarService);

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect that is triggered within `ErrorType.SHOW_SNACKBAR` action.
   * This effect will call `SnackbarService` to create snackbar message
   * about specified error.
   *
   * Within this effect we won't dispatch any other store actions.
   */
  private showSnackbarEffect$: Observable<void> = createEffect((): Observable<void> =>
    this.actions$.pipe(
      ofType(errorActions.showSnackbar),
      map((action): ServerErrorInterface => action.error),
      map((error: ServerErrorInterface): void => {
        this.snackbarService
          .error(error)
          .finally();
      }),
    ),
    { dispatch: false },
  );
}
