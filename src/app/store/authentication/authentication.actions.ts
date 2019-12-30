import { createAction, props } from '@ngrx/store';

import { ServerErrorInterface } from '../../shared/interfaces';
import { AuthenticationActionTypeEnum } from './authentication-action-type.enum';
import { CredentialsRequestInterface, UserProfileInterface } from '../../auth/interfaces';

const login = createAction(
  AuthenticationActionTypeEnum.LOGIN,
  props<{ credentials: CredentialsRequestInterface }>(),
);

const loginSuccess = createAction(
  AuthenticationActionTypeEnum.LOGIN_SUCCESS,
  props<{ roles: Array<string> }>(),
);

const loginFailure = createAction(
  AuthenticationActionTypeEnum.LOGIN_FAILURE,
  props<{ error: ServerErrorInterface }>(),
);

const profile = createAction(AuthenticationActionTypeEnum.PROFILE);

const profileSuccess = createAction(
  AuthenticationActionTypeEnum.PROFILE_SUCCESS,
  props<{ profile: UserProfileInterface }>(),
);

const profileFailure = createAction(
  AuthenticationActionTypeEnum.PROFILE_FAILURE,
  props<{ error: ServerErrorInterface }>(),
);

export const authenticationActions = {
  login,
  loginSuccess,
  loginFailure,
  profile,
  profileSuccess,
  profileFailure,
};
