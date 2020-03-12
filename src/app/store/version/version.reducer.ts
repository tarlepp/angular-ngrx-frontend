import { Action, createReducer, on } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { VersionState } from 'src/app/store/store-states';
import { versionActions } from 'src/app/store/store-actions';

const initialState = {
  frontend: environment.version,
  loading: false,
  error: null,
} as VersionState;

const reducer = createReducer(
  initialState,
  on(
    versionActions.fetchFrontendVersion,
    (state: VersionState): VersionState => ({
      ...state,
      loading: true,
      error: null,
    }),
  ),
  on(
    versionActions.fetchFrontendVersionSuccess,
    (state: VersionState, { version }): VersionState => ({
      ...state,
      loading: false,
      frontend: version,
    }),
  ),
  on(
    versionActions.fetchFrontendVersionFailure,
    (state: VersionState, { error }): VersionState => ({
      ...state,
      loading: false,
      error,
    }),
  ),
);

export function versionReducer(state: VersionState, action: Action): VersionState {
  return reducer(state, action);
}
