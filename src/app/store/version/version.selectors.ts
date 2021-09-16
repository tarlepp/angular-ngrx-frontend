import { createFeatureSelector, createSelector } from '@ngrx/store';

import { selectServerErrorAwareState } from 'src/app/shared/utils';
import { VersionState } from 'src/app/store';

/**
 * Selectors for `VersionState` store.
 *
 * Simple usage example;
 *
 *  constructor(private store: Store) { }
 *
 *  public ngOnInit(): void {
 *    // Initialize `versionFrontend$` and `versionBackend$` observables
 *    this.versionFrontend$ = this.store.select(versionSelectors.frontend);
 *    this.versionBackend$ = this.store.select(versionSelectors.backend);
 *  }
 */

// Feature selector for `version` store.
const selectFeature = createFeatureSelector<VersionState>('version');

// Common selectors for this store
const selectFrontendVersion = createSelector(selectFeature, (state: VersionState): string => state.frontend);
const selectBackendVersion = createSelector(selectFeature, (state: VersionState): string => state.backend);
const selectIsLoadingFrontendVersion = createSelector(selectFeature, (state: VersionState): boolean => state.isLoadingFrontend);
const selectIsLoadingBackendVersion = createSelector(selectFeature, (state: VersionState): boolean => state.isLoadingBackend);

// Aware state selectors
const selectError = selectServerErrorAwareState(selectFeature);

// Selector for frontend/backend version loading state.
const selectIsLoading = createSelector(selectIsLoadingFrontendVersion, selectIsLoadingBackendVersion, (a: boolean, b: boolean): boolean => a || b);

// Export all store selectors, so that those can be used easily.
export const versionSelectors = {
  selectFrontendVersion,
  selectBackendVersion,
  selectIsLoadingFrontendVersion,
  selectIsLoadingBackendVersion,
  selectIsLoading,
  selectError,
};
