import { AuthenticationAction, LayoutAction } from 'src/app/store/store.action';

export type AuthenticationLoginType =
  AuthenticationAction.LOGIN_SUCCESS
  | AuthenticationAction.LOGIN_FAILURE;

export type AuthenticationProfileType =
  AuthenticationAction.PROFILE_SUCCESS
  | AuthenticationAction.PROFILE_FAILURE;

export type LoginSuccessTypes =
  AuthenticationAction.PROFILE
  | LayoutAction.CHANGE_LOCALIZATION;
