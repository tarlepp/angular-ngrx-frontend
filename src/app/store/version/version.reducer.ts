import { Action, createReducer, on } from '@ngrx/store';

import { ServerErrorValueInterface, VersionInterface } from 'src/app/shared/interfaces';
import { versionActions } from 'src/app/store/store-actions';
import { VersionState } from 'src/app/store/store-states';
import { environment } from 'src/environments/environment';

// Initial state of `Version` store.
const initialState: VersionState = {
  frontend: environment.version,
  backend: '0.0.0',
  loadingFrontend: false,
  loadingBackend: false,
  error: null,
};

const reducer = createReducer(
  initialState,
  /**
   * Reducer for `versionActions.fetchFrontendVersion` where we want to set
   * loading state of frontend version to `true`.
   */
  on(
    versionActions.fetchFrontendVersion,
    (state: VersionState): VersionState => ({
      ...state,
      loadingFrontend: true,
      error: null,
    }),
  ),
  /**
   * Reducer for `versionActions.fetchFrontendVersionSuccess` where we're
   * setting frontend version to current state.
   */
  on(
    versionActions.fetchFrontendVersionSuccess,
    (state: VersionState, { version }: VersionInterface): VersionState => ({
      ...state,
      loadingFrontend: false,
      frontend: version,
    }),
  ),
  /**
   * Reducer for `versionActions.fetchFrontendVersionFailure` where we're
   * storing occurred error to store.
   */
  on(
    versionActions.fetchFrontendVersionFailure,
    (state: VersionState, { error }: ServerErrorValueInterface): VersionState => ({
      ...state,
      loadingFrontend: false,
      error,
    }),
  ),
  /**
   * Reducer for `versionActions.fetchBackendVersion` where we want to set
   * loading state of backend version to `true`.
   */
  on(
    versionActions.fetchBackendVersion,
    (state: VersionState): VersionState => ({
      ...state,
      loadingBackend: true,
      error: null,
    }),
  ),
  /**
   * Reducer for `versionActions.fetchBackendVersionSuccess` where we're
   * storing backend version to current state.
   */
  on(
    versionActions.fetchBackendVersionSuccess,
    (state: VersionState, { version }: VersionInterface): VersionState => ({
      ...state,
      loadingBackend: false,
      backend: version,
    }),
  ),
  /**
   * Reducer for `versionActions.fetchBackendVersionFailure` where we're
   * storing occurred error to store.
   */
  on(
    versionActions.fetchBackendVersionFailure,
    (state: VersionState, { error }: ServerErrorValueInterface): VersionState => ({
      ...state,
      loadingBackend: false,
      error,
    }),
  ),
);

// Export error `Version` store reducer.
export function versionReducer(state: VersionState, action: Action): VersionState {
  return reducer(state, action);
}
