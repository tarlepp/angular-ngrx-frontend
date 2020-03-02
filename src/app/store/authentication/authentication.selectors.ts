import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthenticationState } from 'src/app/store/store-states';
import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { Role } from 'src/app/auth/enums';

const authenticationState = createFeatureSelector<AuthenticationState>('authentication');
const loading = createSelector(authenticationState, (state: AuthenticationState): boolean => state.loading);
const loggedIn = createSelector(authenticationState, (state: AuthenticationState): boolean => state.loggedIn);
const profile = createSelector(authenticationState, (state: AuthenticationState): UserProfileInterface|null => state.profile);
const roles = createSelector(authenticationState, (state: AuthenticationState): Array<Role> => state.userData?.roles || []);
const userData = createSelector(authenticationState, (state: AuthenticationState): UserDataInterface|null => state.userData);
const error = createSelector(authenticationState, (state: AuthenticationState): ServerErrorInterface|null => state.error);

export const authenticationSelectors = {
  loading,
  loggedIn,
  profile,
  roles,
  userData,
  error,
};
