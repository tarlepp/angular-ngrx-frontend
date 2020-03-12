import { createAction, props } from '@ngrx/store';

import { VersionAction } from 'src/app/store/store.action';
import { ServerErrorInterface } from 'src/app/shared/interfaces';

const fetchFrontendVersion = createAction(VersionAction.FETCH_FRONTEND_VERSION);
const fetchFrontendVersionSuccess = createAction(
  VersionAction.FETCH_FRONTEND_VERSION_SUCCESS,
  props<{ version: string }>(),
);
const fetchFrontendVersionFailure = createAction(
  VersionAction.FETCH_FRONTEND_VERSION_FAILURE,
  props<{ error: ServerErrorInterface }>(),
);

export const versionActions = {
  fetchFrontendVersion,
  fetchFrontendVersionSuccess,
  fetchFrontendVersionFailure,
};
