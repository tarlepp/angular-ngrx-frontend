import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';

import { errorActions, ErrorState } from '../../store/error';
import { ServerErrorInterface } from '../interfaces';

@Injectable()
export class SnackbarService {
  public constructor(private snackBar: MatSnackBar, private errorStore: Store<ErrorState>) { }

  public message(message: string, duration: number = 6000): Promise<MatSnackBarRef<SimpleSnackBar>> {
    return new Promise<MatSnackBarRef<SimpleSnackBar>>((resolve): void => {
      const config = {
        duration,
        panelClass: ['snackbar'],
      } as MatSnackBarConfig;

      resolve(this.snackBar.open(message, 'Close', config));
    });
  }

  public error(error: ServerErrorInterface): Promise<MatSnackBarRef<SimpleSnackBar>> {
    return new Promise<MatSnackBarRef<SimpleSnackBar>>((resolve): void => {
      const config = {
        panelClass: ['snackbar', 'snackbar--error'],
      } as MatSnackBarConfig;

      const ref = this.snackBar.open(error.message, 'Close', config);

      ref.afterDismissed().subscribe((): void => {
        this.errorStore.dispatch(errorActions.clearSnackbar());
      });

      resolve(ref);
    });
  }
}
