import { Action, createReducer, on } from '@ngrx/store';

import { AuthenticationState } from './authentication.state';
import { authenticationActions } from './authentication.actions';

const initialState = {
  loading: false,
  loggedIn: false,
  roles: [],
  profile: null,
  error: null,
} as AuthenticationState;

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
    (state: AuthenticationState, { roles }): AuthenticationState => ({
      ...state,
      loading: false,
      loggedIn: true,
      roles,
    }),
  ),
  on(
    authenticationActions.loginFailure,
    (state: AuthenticationState, { error }): AuthenticationState => ({
      ...state,
      loading: false,
      error,
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
    (state: AuthenticationState, { profile }): AuthenticationState => ({
      ...state,
      loading: false,
      profile,
    }),
  ),
  on(
    authenticationActions.profileFailure,
    (state: AuthenticationState, { error }): AuthenticationState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
  on(authenticationActions.logout, (): AuthenticationState => initialState),
);

export function authenticationReducer(state: AuthenticationState|undefined, action: Action): AuthenticationState {
  return reducer(state, action);
}
