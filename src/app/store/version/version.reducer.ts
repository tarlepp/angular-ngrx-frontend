import { Action, createReducer, on } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { VersionState } from 'src/app/store/store-states';
import { versionActions } from 'src/app/store/store-actions';

const initialState = {
  frontend: environment.version,
  backend: '0.0.0',
  loadingFrontend: false,
  loadingBackend: false,
  error: null,
} as VersionState;

const reducer = createReducer(
  initialState,
  on(
    versionActions.fetchFrontendVersion,
    (state: VersionState): VersionState => ({
      ...state,
      loadingFrontend: true,
      error: null,
    }),
  ),
  on(
    versionActions.fetchFrontendVersionSuccess,
    (state: VersionState, { version }): VersionState => ({
      ...state,
      loadingFrontend: false,
      frontend: version,
    }),
  ),
  on(
    versionActions.fetchFrontendVersionFailure,
    (state: VersionState, { error }): VersionState => ({
      ...state,
      loadingFrontend: false,
      error,
    }),
  ),
  on(
    versionActions.fetchBackendVersion,
    (state: VersionState): VersionState => ({
      ...state,
      loadingBackend: true,
      error: null,
    }),
  ),
  on(
    versionActions.fetchBackendVersionSuccess,
    (state: VersionState, { version }): VersionState => ({
      ...state,
      loadingBackend: false,
      backend: version,
    }),
  ),
  on(
    versionActions.fetchBackendVersionFailure,
    (state: VersionState, { error }): VersionState => ({
      ...state,
      loadingBackend: false,
      error,
    }),
  ),
);

export function versionReducer(state: VersionState, action: Action): VersionState {
  return reducer(state, action);
}
