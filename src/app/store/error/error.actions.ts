import { createAction, props } from '@ngrx/store';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { ErrorType } from 'src/app/store/store.types';

/**
 * Error store actions definitions, each of these actions will change the
 * state of this store.
 *
 * Simple usage example;
 *
 *  public constructor(private store: Store) { }
 *
 *  public ngOnInit(): void {
 *    const error: ServerErrorInterface = {
 *      code: 0,
 *      message: 'Some message',
 *      status: 0,
 *      statusText: '',
 *    };
 *
 *    // Dispatch action to show error in snackbar
 *    this.store.dispatch(errorActions.showSnackbar({ error }));
 *  }
 */

/**
 * Action to trigger snackbar with specified error. Usually this action
 * is dispatched from application `ErrorInterceptor` - if and when some
 * HTTP error occurred. But there is no reason for you not to use this
 * if there is some special need to show some error message easily.
 */
const showSnackbar = createAction(ErrorType.SHOW_SNACKBAR, props<{ error: ServerErrorInterface }>());

/**
 * Action to clear snackbar error, this is called from snackbar service
 * when user dismiss that error snackbar - so this action is basically
 * just for internal usage.
 *
 * @internal
 */
const clearSnackbar = createAction(ErrorType.CLEAR_SNACKBAR);

// Export all store actions, so that those can be used easily.
export const errorActions = {
  showSnackbar,
  clearSnackbar,
};
