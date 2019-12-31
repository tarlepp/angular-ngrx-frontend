import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthenticationState } from './authentication.state';
import { ServerErrorInterface } from '../../shared/interfaces';
import { UserProfileInterface } from '../../auth/interfaces';

const authenticationState = createFeatureSelector<AuthenticationState>('authentication');
const loading = createSelector(authenticationState, (state: AuthenticationState): boolean => state.loading);
const loggedIn = createSelector(authenticationState, (state: AuthenticationState): boolean => state.loggedIn);
const profile = createSelector(authenticationState, (state: AuthenticationState): UserProfileInterface => state.profile);
const error = createSelector(authenticationState, (state: AuthenticationState): ServerErrorInterface|null => state.error);

export const authenticationSelectors = {
  loading,
  loggedIn,
  profile,
  error,
};
