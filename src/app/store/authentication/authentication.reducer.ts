import { Action, createReducer, on } from '@ngrx/store';

import { UserDataValueInterface, UserProfileValueInterface } from 'src/app/auth/interfaces';
import { ServerErrorValueInterface } from 'src/app/shared/interfaces';
import { authenticationActions } from 'src/app/store/store-actions';
import { AuthenticationState } from 'src/app/store/store-states';

const initialState: AuthenticationState = {
  loading: false,
  loggedIn: false,
  userData: null,
  profile: null,
  error: null,
};

const reducer = createReducer(
  initialState,
  on(
    authenticationActions.login,
    (state: AuthenticationState): AuthenticationState => ({
      ...state,
      loading: true,
      loggedIn: false,
      error: null,
    }),
  ),
  on(
    authenticationActions.loginSuccess,
    (state: AuthenticationState, { userData }: UserDataValueInterface): AuthenticationState => ({
      ...state,
      loading: false,
      loggedIn: true,
      userData,
    }),
  ),
  on(
    authenticationActions.profile,
    (state: AuthenticationState): AuthenticationState => ({
      ...state,
      loading: true,
      profile: null,
    }),
  ),
  on(
    authenticationActions.profileSuccess,
    (state: AuthenticationState, { profile }: UserProfileValueInterface): AuthenticationState => ({
      ...state,
      loading: false,
      profile,
    }),
  ),
  on(
    authenticationActions.loginFailure,
    authenticationActions.profileFailure,
    (state: AuthenticationState, { error }: ServerErrorValueInterface): AuthenticationState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(authenticationActions.logout, (): AuthenticationState => initialState),
);

export function authenticationReducer(state: AuthenticationState, action: Action): AuthenticationState {
  return reducer(state, action);
}
