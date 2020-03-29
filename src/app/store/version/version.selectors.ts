import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { VersionState } from 'src/app/store/store-states';

/**
 * Selectors for `VersionState` store.
 *
 * Simple usage example;
 *
 *  constructor(private versionStore: Store<VersionState>) { }
 *
 *  public ngOnInit(): void {
 *    // Initialize `versionFrontend$` and `versionBackend$` observables
 *    this.versionFrontend$ = this.versionStore.select(versionSelectors.versionFrontend);
 *    this.versionBackend$ = this.versionStore.select(versionSelectors.versionBackend);
 *  }
 */

// Feature selector for `version` store.
const versionState = createFeatureSelector<VersionState>('version');

// Selector for frontend version.
const versionFrontend = createSelector(versionState, (state: VersionState): string => state.frontend);

// Selector for backend version.
const versionBackend = createSelector(versionState, (state: VersionState): string => state.backend);

// Selector for frontend version loading state.
const loadingFrontend = createSelector(versionState, (state: VersionState): boolean => state.loadingFrontend);

// Selector for backend version loading state.
const loadingBackend = createSelector(versionState, (state: VersionState): boolean => state.loadingBackend);

// Selector for frontend/backend version loading state.
const loading = createSelector(loadingFrontend, loadingBackend, (a: boolean, b: boolean): boolean => a || b);

// Selector for error state.
const error = createSelector(versionState, (state: VersionState): ServerErrorInterface|null => state.error);

// Export all store selectors, so that those can be used easily.
export const versionSelectors = {
  versionFrontend,
  versionBackend,
  loadingFrontend,
  loadingBackend,
  loading,
  error,
};
