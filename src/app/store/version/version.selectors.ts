import { createFeatureSelector, createSelector } from '@ngrx/store';

import { VersionState } from 'src/app/store/store-states';
import { ServerErrorInterface } from 'src/app/shared/interfaces';

const versionState = createFeatureSelector<VersionState>('version');
const versionFrontend = createSelector(versionState, (state: VersionState): string => state.frontend);
const versionBackend = createSelector(versionState, (state: VersionState): string => state.backend);
const loadingFrontend = createSelector(versionState, (state: VersionState): boolean => state.loadingFrontend);
const loadingBackend = createSelector(versionState, (state: VersionState): boolean => state.loadingBackend);
const loading = createSelector(loadingFrontend, loadingBackend, (a, b): boolean => a || b);
const error = createSelector(versionState, (state: VersionState): ServerErrorInterface|null => state.error);

export const versionSelectors = {
  versionFrontend,
  versionBackend,
  loadingFrontend,
  loadingBackend,
  loading,
  error,
};
