import { Action, createReducer, on } from '@ngrx/store';

import { UserDataValueInterface, UserProfileValueInterface } from 'src/app/auth/interfaces';
import { ServerErrorValueInterface } from 'src/app/shared/interfaces';
import { AuthenticationState, authenticationActions } from 'src/app/store';

// Initial state of `Authentication` store.
const initialState: AuthenticationState = {
  isLoading: false,
  isLoggedIn: false,
  userData: null,
  profile: null,
  error: null,
};

const reducer = createReducer(
  initialState,
  /**
   * Login action where we want to enable `loading` state in store and reset
   * possible error.
   */
  on(
    authenticationActions.login,
    (state: AuthenticationState): AuthenticationState => ({
      ...state,
      isLoading: true,
      isLoggedIn: false,
      error: null,
    }),
  ),
  /**
   * Login success action where we disable `loading`, tell that current user
   * is `loggedIn` and save logged in user data to store.
   */
  on(
    authenticationActions.loginSuccess,
    (state: AuthenticationState, { userData }: UserDataValueInterface): AuthenticationState => ({
      ...state,
      isLoading: false,
      isLoggedIn: true,
      userData,
    }),
  ),
  /**
   * Profile fetch action where we want to enable `loading` state in store and
   * reset possible error.
   */
  on(
    authenticationActions.profile,
    (state: AuthenticationState): AuthenticationState => ({
      ...state,
      isLoading: true,
      profile: null,
    }),
  ),
  /**
   * Profile fetched successfully, so we want to disable `loading` state and
   * save user profile data to store.
   */
  on(
    authenticationActions.profileSuccess,
    (state: AuthenticationState, { profile }: UserProfileValueInterface): AuthenticationState => ({
      ...state,
      isLoading: false,
      profile,
    }),
  ),
  /**
   * Possible error actions, here we want to reset `loading` and `loggedIn`
   * data and save that actual error to our store.
   */
  on(
    authenticationActions.loginFailure,
    authenticationActions.profileFailure,
    (state: AuthenticationState, { error }: ServerErrorValueInterface): AuthenticationState => ({
      ...state,
      isLoading: false,
      isLoggedIn: false,
      error,
    }),
  ),
  on(
    authenticationActions.resetError,
    (state: AuthenticationState): AuthenticationState => ({
      ...state,
      error: null,
    }),
  ),
  /**
   * If/when user makes logout within this application we need to reset this
   * store state to initial one, so that there isn't anything user related
   * stuff on our store.
   */
  on(authenticationActions.logout, (): AuthenticationState => ({ ...initialState })),
);

// Export `Authentication` store reducer.
export const authenticationReducer = (state: AuthenticationState|undefined, action: Action): AuthenticationState => reducer(state, action);
