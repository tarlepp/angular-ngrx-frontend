/**
 * Authentication store action definitions.
 */
export enum AuthenticationAction {
  LOGIN = '[Authentication] Login',
  LOGIN_SUCCESS = '[Authentication] Login success',
  LOGIN_FAILURE = '[Authentication] Login failure',
  PROFILE = '[Authentication] Profile',
  PROFILE_SUCCESS = '[Authentication] Profile success',
  PROFILE_FAILURE = '[Authentication] Profile failure',
  LOGOUT = '[Authentication] Logout',
}
