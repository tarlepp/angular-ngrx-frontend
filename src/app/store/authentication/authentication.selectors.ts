import { createFeatureSelector, createSelector, MemoizedSelector, select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Role } from 'src/app/auth/enums';
import { UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { createSelectorIsLoading, createSelectorServerError } from 'src/app/shared/utils';
import { AuthenticationState } from 'src/app/store';

/**
 * Selectors for `AuthenticationState` store.
 *
 * Simple usage example;
 *
 *  public constructor(private store: Store) { }
 *
 *  public ngOnInit(): void {
 *    this.isLoading$ = this.store.select(authenticationSelectors.isLoading);
 *    this.isLoggedIn$ = this.store.select(authenticationSelectors.isLoggedIn);
 *  }
 */

// Feature selector for `authentication` store
const featureSelector = createFeatureSelector<AuthenticationState>('authentication');

// Common selectors for this store
const isLoading = createSelectorIsLoading(featureSelector);
const isLoggedIn = createSelector(featureSelector, (state: AuthenticationState): boolean => state.isLoggedIn);
const profile = createSelector(featureSelector, (state: AuthenticationState): UserProfileInterface|null => state.profile);
const roles = createSelector(featureSelector, (state: AuthenticationState): Array<Role> => state.userData?.roles || []);
const userData = createSelector(featureSelector, (state: AuthenticationState): UserDataInterface|null => state.userData);
const hasRole = (role: Role | string): MemoizedSelector<any, boolean> => createSelector(
  roles,
  (userRoles: Array<Role>): boolean => !!role && userRoles.includes(role as Role),
);
const error = createSelectorServerError(featureSelector);

// Filtered error selector - this will always return `ServerErrorInterface`
const filteredError = pipe(
  select(error),
  filter((x: ServerErrorInterface|null): boolean => x !== null),
);

// Export all store selectors, so that those can be used easily.
export const authenticationSelectors = {
  isLoading,
  isLoggedIn,
  profile,
  roles,
  userData,
  hasRole,
  error,
  filteredError,
};
