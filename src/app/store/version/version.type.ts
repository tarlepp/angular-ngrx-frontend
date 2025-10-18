// Version store action definitions.
export enum VersionType {
  FETCH_VERSIONS = '[Version] Fetch versions',
  FETCH_FRONTEND_VERSION = '[Version] Fetch frontend version',
  FETCH_FRONTEND_VERSION_SUCCESS = '[Version] Fetch frontend version success',
  FETCH_FRONTEND_VERSION_FAILURE = '[Version] Fetch frontend version failure',
  FETCH_BACKEND_VERSION = '[Version] Fetch backend version',
  FETCH_BACKEND_VERSION_SUCCESS = '[Version] Fetch backend version success',
  FETCH_BACKEND_VERSION_FAILURE = '[Version] Fetch backend version failure',
  NEW_BACKEND_VERSION = '[Version] New backend version - check if frontend version is also changed',
}

export type FetchVersionsTypes = VersionType.FETCH_BACKEND_VERSION
  | VersionType.FETCH_FRONTEND_VERSION;

// Frontend version types
export type FrontendVersionTypes = VersionType.FETCH_FRONTEND_VERSION_SUCCESS
  | VersionType.FETCH_FRONTEND_VERSION_FAILURE;

// Backend version types
export type BackendVersionTypes = VersionType.FETCH_BACKEND_VERSION_SUCCESS
  | VersionType.FETCH_BACKEND_VERSION_FAILURE;

export type NewBackendVersionTypes = VersionType.FETCH_FRONTEND_VERSION
  | VersionType.FETCH_BACKEND_VERSION_SUCCESS;
