import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { map, pluck } from 'rxjs/operators';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { SnackbarService } from 'src/app/shared/services';
import { errorActions } from 'src/app/store/store-actions';

@Injectable()
export class ErrorEffects {
  // noinspection JSUnusedLocalSymbols
  private snackbarError$ = createEffect((): Observable<void> =>
    this.actions$.pipe(
      ofType(errorActions.snackbar),
      pluck('error'),
      map((error: ServerErrorInterface): void => {
        this.snackbarService
          .error(error)
          .finally();
      }),
    ),
    { dispatch: false },
  );

  public constructor(private actions$: Actions, private snackbarService: SnackbarService) { }
}
