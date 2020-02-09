import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

// noinspection TypeScriptPreferShortImport - Circular dependency detected
import { errorActions } from '../../store/error/error.actions';
import { ErrorState } from '../../store/error';
import { ServerErrorInterface } from '../interfaces';

@Injectable()
export class SnackbarService {
  private closeButtonTag = 'snackbar.close-button';

  public constructor(
    private snackBar: MatSnackBar,
    private errorStore: Store<ErrorState>,
    private translateService: TranslateService,
  ) { }

  public message(message: string, duration: number = 6000): Promise<MatSnackBarRef<SimpleSnackBar>> {
    return new Promise<MatSnackBarRef<SimpleSnackBar>>((resolve): void => {
      const config = {
        duration,
        panelClass: ['snackbar'],
      } as MatSnackBarConfig;

      this.translateService
        .get([message, this.closeButtonTag])
        .pipe(take(1))
        .subscribe((texts: {[key: string]: string}): void =>
          resolve(this.snackBar.open(texts[message], texts[this.closeButtonTag], config)),
        );
    });
  }

  public error(error: ServerErrorInterface): Promise<MatSnackBarRef<SimpleSnackBar>> {
    return new Promise<MatSnackBarRef<SimpleSnackBar>>((resolve): void => {
      const config = {
        panelClass: ['snackbar', 'snackbar--error'],
      } as MatSnackBarConfig;

      this.translateService
        .get(this.closeButtonTag)
        .pipe(take(1))
        .subscribe((closeButtonText: string): void => {
          const matSnackBarRef = this.snackBar.open(error.message, closeButtonText, config);

          matSnackBarRef
            .afterDismissed()
            .subscribe((): void => this.errorStore.dispatch(errorActions.clearSnackbar()));

          resolve(matSnackBarRef);
        });
    });
  }
}
