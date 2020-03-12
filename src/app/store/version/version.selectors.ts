import { createFeatureSelector, createSelector } from '@ngrx/store';

import { VersionState } from 'src/app/store/store-states';
import { ServerErrorInterface } from 'src/app/shared/interfaces';

const versionState = createFeatureSelector<VersionState>('version');
const versionFrontend = createSelector(versionState, (state: VersionState): string => state.frontend);
const loading = createSelector(versionState, (state: VersionState): boolean => state.loading);
const error = createSelector(versionState, (state: VersionState): ServerErrorInterface|null => state.error);

export const versionSelectors = {
  versionFrontend,
  loading,
  error,
};
