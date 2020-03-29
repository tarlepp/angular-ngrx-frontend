import { VersionAction } from 'src/app/store/version/version.action';

/**
 * Combined types that are used within `Version` store. These are used on
 * `effect` part of this store.
 */

// Frontend version types
export type FrontendVersionTypes =
  VersionAction.FETCH_FRONTEND_VERSION_SUCCESS
  | VersionAction.FETCH_FRONTEND_VERSION_FAILURE;

// Backend version types
export type BackendVersionTypes =
  VersionAction.FETCH_BACKEND_VERSION_SUCCESS
  | VersionAction.FETCH_BACKEND_VERSION_FAILURE;
