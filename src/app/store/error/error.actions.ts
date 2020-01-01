import { createAction, props } from '@ngrx/store';

import { ServerErrorInterface } from '../../shared/interfaces';
import { ErrorActionType } from './error-action.type';

const snackbar = createAction(
  ErrorActionType.SNACKBAR,
  props<{ error: ServerErrorInterface }>(),
);

const clearSnackbar = createAction(ErrorActionType.CLEAR_SNACKBAR);

export const errorActions = {
  snackbar,
  clearSnackbar,
};
