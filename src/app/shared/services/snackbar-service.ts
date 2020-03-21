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
  private closeButtonTag: string = marker('snackbar.close-button');

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private snackBar: MatSnackBar,
    private errorStore: Store<ErrorState>,
    private translateService: TranslateService,
  ) { }

  /**
   * Method to create plain snackbar message with specified content.
   */
  public message(message: string, duration: number = 6000): Promise<MatSnackBarRef<SimpleSnackBar>> {
    return new Promise<MatSnackBarRef<SimpleSnackBar>>((resolve: any): void => {
      const config: MatSnackBarConfig = {
        duration,
        panelClass: ['snackbar'],
      };

      this.translateService
        .get([message, this.closeButtonTag])
        .pipe(take(1))
        .subscribe((texts: {[key: string]: string}): void =>
          resolve(this.snackBar.open(texts[message], texts[this.closeButtonTag], config)),
        );
    });
  }

  /**
   * Method to create error snackbar message from specified server error. This
   * will either use simple snackbar or custom snackbar component if that error
   * contains data that can be shown in that separated component - these errors
   * are usually backend validation related errors.
   */
  public error(error: ServerErrorInterface): Promise<MatSnackBarRef<SimpleSnackBar|ErrorMessageComponent>> {
    return new Promise<MatSnackBarRef<SimpleSnackBar>>((resolve: any): void => {
      const config: MatSnackBarConfig = {
        panelClass: ['snackbar', 'snackbar--error'],
      };

      let serverErrorMessages: Array<ErrorMessageServerInterface> = [];

      try {
        serverErrorMessages = JSON.parse(error.message);

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
