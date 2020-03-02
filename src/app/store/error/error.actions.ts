import { createAction, props } from '@ngrx/store';

import { ErrorAction } from 'src/app/store/store.action';
import { ServerErrorInterface } from 'src/app/shared/interfaces';

const snackbar = createAction(ErrorAction.SNACKBAR, props<{ error: ServerErrorInterface }>());
const clearSnackbar = createAction(ErrorAction.CLEAR_SNACKBAR);

export const errorActions = {
  snackbar,
  clearSnackbar,
};
