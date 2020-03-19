import { Action, createReducer, on } from '@ngrx/store';

import { ServerErrorValueInterface } from 'src/app/shared/interfaces';
import { errorActions } from 'src/app/store/store-actions';
import { ErrorState } from 'src/app/store/store-states';

const initialState: ErrorState = {
  errorSnackbar: null,
};

const reducer = createReducer(
  initialState,
  on(
    errorActions.snackbar,
    (state: ErrorState, { error }: ServerErrorValueInterface): ErrorState => ({
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
