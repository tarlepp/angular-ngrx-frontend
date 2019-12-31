import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, pluck } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { SnackbarService } from '../../shared/services';
import { errorActions } from './error.actions';
import { ServerErrorInterface } from '../../shared/interfaces';

@Injectable()
export class ErrorEffects {
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
