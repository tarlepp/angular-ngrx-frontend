import { createAction, props } from '@ngrx/store';

import { AuthenticationActionTypeEnum } from './authentication-action-type.enum';
import { CredentialsRequestInterface } from '../../auth/interfaces';
import { ServerErrorInterface } from '../../shared/interfaces';

const login = createAction(
  AuthenticationActionTypeEnum.LOGIN,
  props<{credentials: CredentialsRequestInterface}>(),
);

const loginSuccess = createAction(
  AuthenticationActionTypeEnum.LOGIN_SUCCESS,
  props<{roles: Array<string>}>(),
);

const loginFailure = createAction(
  AuthenticationActionTypeEnum.LOGIN_FAILURE,
  props<{error: ServerErrorInterface}>(),
);

export const authenticationActions = {
  login,
  loginSuccess,
  loginFailure,
};
