import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Role } from 'src/app/auth/enums';
import { UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { AuthenticationState } from 'src/app/store';

/**
 * Selectors for `AuthenticationState` store.
 *
 * Simple usage example;
 *
 *  public constructor(private store: Store<AppState>) { }
 *
 *  public ngOnInit(): void {
 *    this.isLoading$ = this.store.select(authenticationSelectors.isLoading);
 *    this.isLoggedIn$ = this.store.select(authenticationSelectors.isLoggedIn);
 *  }
 */

// Feature selector for `authentication` store
const featureSelector = createFeatureSelector<AuthenticationState>('authentication');

// Common selectors for this store
const isLoading = createSelector(featureSelector, (state: AuthenticationState): boolean => state.isLoading);
const isLoggedIn = createSelector(featureSelector, (state: AuthenticationState): boolean => state.isLoggedIn);
const profile = createSelector(featureSelector, (state: AuthenticationState): UserProfileInterface|null => state.profile);
const roles = createSelector(featureSelector, (state: AuthenticationState): Array<Role> => state.userData?.roles || []);
const userData = createSelector(featureSelector, (state: AuthenticationState): UserDataInterface|null => state.userData);
const error = createSelector(featureSelector, (state: AuthenticationState): ServerErrorInterface|null => state.error);

// Export all store selectors, so that those can be used easily.
export const authenticationSelectors = {
  isLoading,
  isLoggedIn,
  profile,
  roles,
  userData,
  error,
};
