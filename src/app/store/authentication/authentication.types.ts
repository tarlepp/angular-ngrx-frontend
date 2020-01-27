import { AuthenticationAction } from './authentication.action';

export type AuthenticationLoginType =
  AuthenticationAction.LOGIN_SUCCESS
  | AuthenticationAction.LOGIN_FAILURE;

export type AuthenticationProfileType =
  AuthenticationAction.PROFILE_SUCCESS
  | AuthenticationAction.PROFILE_FAILURE;
