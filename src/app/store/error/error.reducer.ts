import { Action, createReducer, on } from '@ngrx/store';

import { ServerErrorValueInterface } from 'src/app/shared/interfaces';
import { errorActions } from 'src/app/store/store-actions';
import { ErrorState } from 'src/app/store/store-states';

// Initial state of `Error` store.
const initialState: ErrorState = {
  errorSnackbar: null,
};

const reducer = createReducer(
  initialState,
  // Action to store specified error to store.
  on(
    errorActions.snackbar,
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
export function errorReducer(state: ErrorState, action: Action): ErrorState {
  return reducer(state, action);
}
