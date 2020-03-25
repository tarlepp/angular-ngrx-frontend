import { ServerErrorInterface } from 'src/app/shared/interfaces';

/**
 * Interface definition for our error store contents.
 *
 *  errorSnackbar
 *    Error object that is shown in snackbar.
 */
export interface ErrorState {
  errorSnackbar: ServerErrorInterface|null;
}
