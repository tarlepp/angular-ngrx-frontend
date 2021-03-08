import { createFeatureSelector, createSelector } from '@ngrx/store';

import { createSelectorServerError } from 'src/app/shared/utils';
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
const featureSelector = createFeatureSelector<VersionState>('version');

// Common selectors for this store
const frontend = createSelector(featureSelector, (state: VersionState): string => state.frontend);
const backend = createSelector(featureSelector, (state: VersionState): string => state.backend);
const isLoadingFrontend = createSelector(featureSelector, (state: VersionState): boolean => state.isLoadingFrontend);
const isLoadingBackend = createSelector(featureSelector, (state: VersionState): boolean => state.isLoadingBackend);
const error = createSelectorServerError(featureSelector);

// Selector for frontend/backend version loading state.
const isLoading = createSelector(isLoadingFrontend, isLoadingBackend, (a: boolean, b: boolean): boolean => a || b);

// Export all store selectors, so that those can be used easily.
export const versionSelectors = {
  frontend,
  backend,
  isLoadingFrontend,
  isLoadingBackend,
  isLoading,
  error,
};
