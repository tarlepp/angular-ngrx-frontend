import { Action, createReducer, on } from '@ngrx/store';

import { errorActions } from 'src/app/store/store-actions';
import { ErrorState } from 'src/app/store/store-states';

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

export function errorReducer(state: ErrorState, action: Action): ErrorState {
  return reducer(state, action);
}
