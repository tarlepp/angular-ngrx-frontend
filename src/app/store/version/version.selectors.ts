import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { VersionState } from 'src/app/store';

/**
 * Selectors for `VersionState` store.
 *
 * Simple usage example;
 *
 *  constructor(private store: Store<AppState>) { }
 *
 *  public ngOnInit(): void {
 *    // Initialize `versionFrontend$` and `versionBackend$` observables
 *    this.versionFrontend$ = this.store.select(VersionSelectors.versionFrontend);
 *    this.versionBackend$ = this.store.select(VersionSelectors.versionBackend);
 *  }
 */

// Feature selector for `version` store.
const versionState = createFeatureSelector<VersionState>('version');

// Common selectors for this store
const frontend = createSelector(versionState, (state: VersionState): string => state.frontend);
const backend = createSelector(versionState, (state: VersionState): string => state.backend);
const isLoadingFrontend = createSelector(versionState, (state: VersionState): boolean => state.isLoadingFrontend);
const isLoadingBackend = createSelector(versionState, (state: VersionState): boolean => state.isLoadingBackend);
const error = createSelector(versionState, (state: VersionState): ServerErrorInterface|null => state.error);

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
