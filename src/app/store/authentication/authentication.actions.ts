import { createAction, props } from '@ngrx/store';

import { ServerErrorInterface } from '../../shared/interfaces';
import { AuthenticationAction } from './authentication.action';
import { CredentialsRequestInterface, UserProfileInterface } from '../../auth/interfaces';
import { Role } from '../../auth/enums';

const login = createAction(AuthenticationAction.LOGIN, props<{credentials: CredentialsRequestInterface}>());
const loginSuccess = createAction(AuthenticationAction.LOGIN_SUCCESS, props<{roles: Array<Role>}>());
const loginFailure = createAction(AuthenticationAction.LOGIN_FAILURE, props<{error: ServerErrorInterface}>());
const profile = createAction(AuthenticationAction.PROFILE);
const profileSuccess = createAction(AuthenticationAction.PROFILE_SUCCESS, props<{profile: UserProfileInterface}>());
const profileFailure = createAction(AuthenticationAction.PROFILE_FAILURE, props<{error: ServerErrorInterface}>());
const logout = createAction(AuthenticationAction.LOGOUT, props<{message?: string}>());

export const authenticationActions = {
  login,
  loginSuccess,
  loginFailure,
  profile,
  profileSuccess,
  profileFailure,
  logout,
};
