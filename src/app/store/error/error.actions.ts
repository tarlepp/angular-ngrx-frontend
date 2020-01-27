import { createAction, props } from '@ngrx/store';

import { ServerErrorInterface } from '../../shared/interfaces';
import { ErrorAction } from './error.action';

const snackbar = createAction(ErrorAction.SNACKBAR, props<{ error: ServerErrorInterface }>());
const clearSnackbar = createAction(ErrorAction.CLEAR_SNACKBAR);

export const errorActions = {
  snackbar,
  clearSnackbar,
};
