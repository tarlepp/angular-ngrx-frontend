import { createAction, props } from '@ngrx/store';

import { ServerErrorInterface } from '../../shared/interfaces';
import { AuthenticationActionType } from './authentication-action.type';
import { CredentialsRequestInterface, UserProfileInterface } from '../../auth/interfaces';
import { Role } from '../../auth/enums';

const login = createAction(
  AuthenticationActionType.LOGIN,
  props<{credentials: CredentialsRequestInterface}>(),
);

const loginSuccess = createAction(
  AuthenticationActionType.LOGIN_SUCCESS,
  props<{roles: Array<Role>}>(),
);

const loginFailure = createAction(
  AuthenticationActionType.LOGIN_FAILURE,
  props<{error: ServerErrorInterface}>(),
);

const profile = createAction(AuthenticationActionType.PROFILE);

const profileSuccess = createAction(
  AuthenticationActionType.PROFILE_SUCCESS,
  props<{profile: UserProfileInterface}>(),
);

const profileFailure = createAction(
  AuthenticationActionType.PROFILE_FAILURE,
  props<{error: ServerErrorInterface}>(),
);

const logout = createAction(
  AuthenticationActionType.LOGOUT,
  props<{message?: string}>(),
);

export const authenticationActions = {
  login,
  loginSuccess,
  loginFailure,
  profile,
  profileSuccess,
  profileFailure,
  logout,
};
