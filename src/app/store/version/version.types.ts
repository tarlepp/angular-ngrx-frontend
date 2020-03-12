import { VersionAction } from 'src/app/store/version/version.action';

export type FrontendVersionTypes =
  VersionAction.FETCH_FRONTEND_VERSION_SUCCESS
| VersionAction.FETCH_FRONTEND_VERSION_FAILURE;
