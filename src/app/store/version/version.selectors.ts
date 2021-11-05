import { createFeatureSelector, createSelector } from '@ngrx/store';

import { selectBooleanValue, selectServerErrorValue } from 'src/app/shared/utils';
import { VersionState } from 'src/app/store';

/**
 * Selectors for `VersionState` store.
 *
 * Simple usage example;
 *
 *  public constructor(private store: Store) {
 *    this.versionFrontend$ = this.store.select(versionSelectors.selectFrontendVersion);
 *    this.versionBackend$ = this.store.select(versionSelectors.selectBackendVersion);
 *  }
 */

// Feature selector for `version` store.
const selectFeature = createFeatureSelector<VersionState>('version');

// Common selectors for this store
const selectFrontendVersion = createSelector(selectFeature, (state: VersionState): string => state.frontend);
const selectBackendVersion = createSelector(selectFeature, (state: VersionState): string => state.backend);
const selectIsLoadingFrontendVersion = selectBooleanValue(selectFeature, 'isLoadingFrontend');
const selectIsLoadingBackendVersion = selectBooleanValue(selectFeature, 'isLoadingBackend');

// Aware state selectors
const selectError = selectServerErrorValue(selectFeature, 'error');

// Selector for frontend/backend version loading state.
const selectIsLoading = createSelector(
  selectIsLoadingFrontendVersion,
  selectIsLoadingBackendVersion,
  (isLoadingFrontend: boolean, isLoadingBackend: boolean): boolean => isLoadingFrontend || isLoadingBackend,
);

// Export all store selectors, so that those can be used easily.
export const versionSelectors = {
  selectFrontendVersion,
  selectBackendVersion,
  selectIsLoadingFrontendVersion,
  selectIsLoadingBackendVersion,
  selectIsLoading,
  selectError,
};
