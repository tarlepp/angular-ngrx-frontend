import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Role } from 'src/app/auth/enums';
import { UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { AuthenticationState } from 'src/app/store/store-states';

/**
 * Selectors for `AuthenticationState` store.
 *
 * Simple usage example;
 *
 *  public constructor(private authenticationStore: Store<AuthenticationState>) { }
 *
 *  public ngOnInit(): void {
 *    this.loading$ = this.authenticationStore.select(authenticationSelectors.loading);
 *    this.loggedIn$ = this.authenticationStore.select(authenticationSelectors.loggedIn);
 *  }
 */

// Feature selector for `authentication` store
const authenticationState = createFeatureSelector<AuthenticationState>('authentication');

// Selector for loading state
const loading = createSelector(authenticationState, (state: AuthenticationState): boolean => state.loading);

// Selector for logged in state
const loggedIn = createSelector(authenticationState, (state: AuthenticationState): boolean => state.loggedIn);

// Selector for profile state
const profile = createSelector(authenticationState, (state: AuthenticationState): UserProfileInterface|null => state.profile);

// Selector for roles state
const roles = createSelector(authenticationState, (state: AuthenticationState): Array<Role> => state.userData?.roles || []);

// Selector for user data state
const userData = createSelector(authenticationState, (state: AuthenticationState): UserDataInterface|null => state.userData);

// Selector for error state
const error = createSelector(authenticationState, (state: AuthenticationState): ServerErrorInterface|null => state.error);

// Export all store selectors, so that those can be used easily.
export const authenticationSelectors = {
  loading,
  loggedIn,
  profile,
  roles,
  userData,
  error,
};
