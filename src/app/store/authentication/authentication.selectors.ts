import { Router, UrlTree } from '@angular/router';
import { createFeatureSelector, createSelector, MemoizedSelector, select } from '@ngrx/store';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Role } from 'src/app/auth/enums';
import { RoleGuardMetaDataInterface, UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
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
const selectFeature = createFeatureSelector<AuthenticationState>('authentication');

// Common selectors for this store
const selectIsLoading = createSelectorIsLoading(selectFeature);
const selectIsLoggedIn = createSelector(selectFeature, (state: AuthenticationState): boolean => state.isLoggedIn);
const selectProfile = createSelector(selectFeature, (state: AuthenticationState): UserProfileInterface|null => state.profile);
const selectRoles = createSelector(selectFeature, (state: AuthenticationState): Array<Role> => state.userData?.roles || []);
const selectUserData = createSelector(selectFeature, (state: AuthenticationState): UserDataInterface|null => state.userData);
const selectHasRole = (role: Role | string): MemoizedSelector<any, boolean> => createSelector(
  selectRoles,
  (userRoles: Array<Role>): boolean => userRoles.includes(role as Role),
);
const selectHasRoles = (haystack: Array<Role | string>): MemoizedSelector<any, boolean> => createSelector(
  selectRoles,
  (userRoles: Array<Role>): boolean => haystack.every((role: Role | string): boolean => userRoles.includes(role as Role)),
);
const selectHasSomeRole = (haystack: Array<Role | string>): MemoizedSelector<any, boolean> => createSelector(
  selectRoles,
  (userRoles: Array<Role>): boolean => haystack.some((role: Role | string): boolean => userRoles.includes(role as Role)),
);
const selectError = createSelectorServerError(selectFeature);

// Filtered error selector - this will always return `ServerErrorInterface`
const selectFilteredError = pipe(
  select(selectError),
  filter((x: ServerErrorInterface|null): boolean => x !== null),
);

/**
 * This selector is for following role guards;
 *  - RoleALoggedGuard
 *  - RoleAdminGuard
 *  - RoleRootGuard
 *  - RoleUserGuard
 *
 * This selector can return a boolean or UrlTree value according to given
 * metaData object. See `BaseRole` class for more information about this.
 */
const selectRoleGuard = (role: Role, metaData: RoleGuardMetaDataInterface, router: Router): MemoizedSelector<any, boolean|UrlTree> =>
  createSelector(
    selectIsLoggedIn,
    selectRoles,
    (loggedIn: boolean, userRoles: Array<Role>): boolean|UrlTree => {
      let output;

      if (!loggedIn) {
        output = metaData.redirect ? router.parseUrl(metaData.routeNotLoggedIn) : false;
      } else if (!userRoles.includes(role)) {
        output = metaData.redirect ? router.parseUrl(metaData.routeNoRole) : false;
      } else {
        output = true;
      }

      return output;
    },
  );

// Export all store selectors, so that those can be used easily.
export const authenticationSelectors = {
  selectIsLoading,
  selectIsLoggedIn,
  selectProfile,
  selectRoles,
  selectUserData,
  selectHasRole,
  selectHasRoles,
  selectHasSomeRole,
  selectError,
  selectFilteredError,
  selectRoleGuard,
};
