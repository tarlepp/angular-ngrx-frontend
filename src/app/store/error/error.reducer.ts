import { Action, createReducer, on } from '@ngrx/store';

import { ServerErrorValueInterface } from 'src/app/shared/interfaces';
import { ErrorState, errorActions } from 'src/app/store';

// Initial state of `Error` store.
const initialState: ErrorState = {
  errorSnackbar: null,
};

const reducer = createReducer(
  initialState,
  // Action to store specified error to store.
  on(
    errorActions.showSnackbar,
    errorActions.showSnackbar,
    errorActions.showSnackbar,
    errorActions.showSnackbar,
    (state: ErrorState, { error }: ServerErrorValueInterface): ErrorState => ({
      ...state,
      errorSnackbar: error,
    }),
  ),
  // Action to clear current snackbar error in store.
  on(
    errorActions.clearSnackbar,
    (state: ErrorState): ErrorState => ({
      ...state,
      errorSnackbar: null,
    }),
  ),
);

// Export error store reducer.
export const errorReducer = (state: ErrorState|undefined, action: Action): ErrorState => reducer(state, action);
