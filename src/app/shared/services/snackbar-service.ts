import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { ErrorMessageComponent } from 'src/app/shared/components';
import { DictionaryInterface, ErrorMessageServerInterface, ServerErrorInterface } from 'src/app/shared/interfaces';
import { errorActions } from 'src/app/store';

type AppErrorMessageSnackBarType = MatSnackBarRef<SimpleSnackBar|ErrorMessageComponent>;
type AppMessageSnackBarType = MatSnackBarRef<SimpleSnackBar>;

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly closeButtonTag: string;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private readonly snackBar: MatSnackBar,
    private readonly translocoService: TranslocoService,
    private readonly store: Store,
  ) {
    this.closeButtonTag = marker('snackbar.close-button');
  }

  /**
   * Method to create plain snackbar message with specified content. MatSnackBarRef<TextOnlySnackBar>
   */
  public message(message: string, duration: number = 6000, params?: unknown|any): Promise<AppMessageSnackBarType> {
    return new Promise<AppMessageSnackBarType>(
      (resolve: (value: AppMessageSnackBarType|PromiseLike<AppMessageSnackBarType>) => void): void => {
        const config: MatSnackBarConfig = {
          duration,
          panelClass: ['snackbar'],
        };

        this.translocoService
          .selectTranslate([message, this.closeButtonTag], params)
          .pipe(take(1))
          .subscribe((texts: DictionaryInterface<string>): void =>
            resolve(this.snackBar.open(texts[message], texts[this.closeButtonTag], config)),
          );
      },
    );
  }

  /**
   * Method to create error snackbar message from specified server error. This
   * will either use simple snackbar or custom snackbar component if that error
   * contains data that can be shown in that separated component - these errors
   * are usually backend validation related errors.
   */
  public error(error: ServerErrorInterface): Promise<AppErrorMessageSnackBarType> {
    return new Promise<AppErrorMessageSnackBarType>(
      (resolve: (value: AppErrorMessageSnackBarType|PromiseLike<AppErrorMessageSnackBarType>) => void): void => {
        const config: MatSnackBarConfig = {
          panelClass: ['snackbar', 'snackbar--error'],
        };

        let serverErrorMessages: Array<ErrorMessageServerInterface> = [];

        try {
          serverErrorMessages = JSON.parse(error.message);

          if (!Array.isArray(serverErrorMessages)) {
            serverErrorMessages = [];
          }
        } catch (e) {
          console.error(e);
        }

        this.translocoService
          .selectTranslate(this.closeButtonTag)
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
              .subscribe((): void => this.store.dispatch(errorActions.clearSnackbar()));

            resolve(matSnackBarRef);
          });
      },
    );
  }
}
