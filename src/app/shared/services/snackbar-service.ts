import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { ErrorMessageComponent } from 'src/app/shared/components';
import { ErrorMessageServerInterface, ServerErrorInterface } from 'src/app/shared/interfaces';
import { errorActions } from 'src/app/store/store-actions';
import { ErrorState } from 'src/app/store/store-states';

@Injectable()
export class SnackbarService {
  private closeButtonTag = marker('snackbar.close-button');

  public constructor(
    private snackBar: MatSnackBar,
    private errorStore: Store<ErrorState>,
    private translateService: TranslateService,
  ) { }

  public message(message: string, duration: number = 6000): Promise<MatSnackBarRef<SimpleSnackBar>> {
    return new Promise<MatSnackBarRef<SimpleSnackBar>>((resolve: any): void => {
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

  public error(error: ServerErrorInterface): Promise<MatSnackBarRef<SimpleSnackBar|ErrorMessageComponent>> {
    return new Promise<MatSnackBarRef<SimpleSnackBar>>((resolve: any): void => {
      const config = {
        panelClass: ['snackbar', 'snackbar--error'],
      } as MatSnackBarConfig;

      let serverErrorMessages = [] as Array<ErrorMessageServerInterface>;

      try {
        serverErrorMessages = JSON.parse(error.message) as Array<ErrorMessageServerInterface>;

        if (!Array.isArray(serverErrorMessages)) {
          serverErrorMessages = [];
        }
      } catch (e) { }

      this.translateService
        .get(this.closeButtonTag)
        .pipe(take(1))
        .subscribe((closeButton: string): void => {
          let matSnackBarRef;

          if (serverErrorMessages.length > 0) {
            matSnackBarRef = this.snackBar.openFromComponent(ErrorMessageComponent, { ...config, data: serverErrorMessages });
          } else {
            matSnackBarRef = this.snackBar.open(error.message, closeButton, config);
          }

          matSnackBarRef
            .afterDismissed()
            .subscribe((): void => this.errorStore.dispatch(errorActions.clearSnackbar()));

          resolve(matSnackBarRef);
        });
    });
  }
}
