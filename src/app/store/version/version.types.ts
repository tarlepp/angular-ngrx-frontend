import { VersionAction } from 'src/app/store/version/version.action';

export type FrontendVersionTypes =
  VersionAction.FETCH_FRONTEND_VERSION_SUCCESS
| VersionAction.FETCH_FRONTEND_VERSION_FAILURE;

export type BackendVersionTypes =
  VersionAction.FETCH_BACKEND_VERSION_SUCCESS
  | VersionAction.FETCH_BACKEND_VERSION_FAILURE;
