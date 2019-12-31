import { Action, createReducer, on } from '@ngrx/store';

import { ErrorState } from './error.state';
import { errorActions } from './error.actions';

const initialState = {
  errorSnackbar: null,
} as ErrorState;

const reducer = createReducer(
  initialState,
  on(
    errorActions.snackbar,
    (state: ErrorState, { error }): ErrorState => ({
      ...state,
      errorSnackbar: error,
    }),
  ),
  on(
    errorActions.clearSnackbar,
    (state: ErrorState): ErrorState => ({
      ...state,
      errorSnackbar: null,
    }),
  ),
);

export function errorReducer(state: ErrorState|undefined, action: Action): ErrorState {
  return reducer(state, action);
}
