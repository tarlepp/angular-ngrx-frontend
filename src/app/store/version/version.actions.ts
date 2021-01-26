import { createAction, props } from '@ngrx/store';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { VersionType } from 'src/app/store/store.types';

/**
 * Version store actions definitions, that you can dispatch to make
 * this store to change is state.
 *
 * These actions are called automatically within this application main
 * component and HTTP interceptor. Most likely you don't need to call
 * these actions at all.
 */

// Common actions for version feature store
const fetchFrontendVersion = createAction(VersionType.FETCH_FRONTEND_VERSION);
const fetchBackendVersion = createAction(VersionType.FETCH_BACKEND_VERSION);

/**
 * Frontend version success action that is triggered via effects.
 *
 * @internal
 */
const fetchFrontendVersionSuccess = createAction(VersionType.FETCH_FRONTEND_VERSION_SUCCESS, props<{ version: string }>());

/**
 * Frontend version failure action that is triggered via effects.
 *
 * @internal
 */
const fetchFrontendVersionFailure = createAction(VersionType.FETCH_FRONTEND_VERSION_FAILURE, props<{ error: ServerErrorInterface }>());

/**
 * Backend version success action that is triggered via effects.
 *
 * @internal
 */
const fetchBackendVersionSuccess = createAction(VersionType.FETCH_BACKEND_VERSION_SUCCESS, props<{ version: string }>());

/**
 * Backend version failure action that is triggered via effects.
 *
 * @internal
 */
const fetchBackendVersionFailure = createAction(VersionType.FETCH_BACKEND_VERSION_FAILURE, props<{ error: ServerErrorInterface }>());

// Export all store actions, so that those can be used easily.
export const versionActions = {
  fetchFrontendVersion,
  fetchFrontendVersionSuccess,
  fetchFrontendVersionFailure,
  fetchBackendVersion,
  fetchBackendVersionSuccess,
  fetchBackendVersionFailure,
};
