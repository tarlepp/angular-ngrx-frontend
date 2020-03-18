import { createAction, props } from '@ngrx/store';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { ErrorAction } from 'src/app/store/store.action';

const snackbar = createAction(ErrorAction.SNACKBAR, props<{ error: ServerErrorInterface }>());
const clearSnackbar = createAction(ErrorAction.CLEAR_SNACKBAR);

export const errorActions = {
  snackbar,
  clearSnackbar,
};
