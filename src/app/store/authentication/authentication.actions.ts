import { createAction, props } from '@ngrx/store';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { CredentialsRequestInterface, UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { AuthenticationAction } from 'src/app/store/store.action';

const login = createAction(AuthenticationAction.LOGIN, props<{ credentials: CredentialsRequestInterface }>());
const loginSuccess = createAction(AuthenticationAction.LOGIN_SUCCESS, props<{ userData: UserDataInterface }>());
const loginFailure = createAction(AuthenticationAction.LOGIN_FAILURE, props<{ error: ServerErrorInterface }>());
const profile = createAction(AuthenticationAction.PROFILE);
const profileSuccess = createAction(AuthenticationAction.PROFILE_SUCCESS, props<{ profile: UserProfileInterface }>());
const profileFailure = createAction(AuthenticationAction.PROFILE_FAILURE, props<{ error: ServerErrorInterface }>());
const logout = createAction(AuthenticationAction.LOGOUT, props<{ message?: string }>());

export const authenticationActions = {
  login,
  loginSuccess,
  loginFailure,
  profile,
  profileSuccess,
  profileFailure,
  logout,
};
