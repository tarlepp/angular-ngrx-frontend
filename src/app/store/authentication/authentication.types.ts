import { AuthenticationAction, LayoutAction } from 'src/app/store/store.action';

/**
 * Combined types that are used within `Authentication` store. These are most
 * likely used on `effects` part of this store.
 */

// Authentication login types.
export type AuthenticationLoginType =
  AuthenticationAction.LOGIN_SUCCESS
  | AuthenticationAction.LOGIN_FAILURE
  | LayoutAction.UPDATE_LOCALIZATION;

// Authentication profile types.
export type AuthenticationProfileType =
  AuthenticationAction.PROFILE_SUCCESS
  | AuthenticationAction.PROFILE_FAILURE;
