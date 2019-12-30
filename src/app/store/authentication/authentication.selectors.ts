import { createFeatureSelector, createSelector } from '@ngrx/store';

import { AuthenticationState } from './authentication.state';
import { ServerErrorInterface } from '../../shared/interfaces';

const authenticationState = createFeatureSelector<AuthenticationState>('authentication');
const loading = createSelector(authenticationState, (state: AuthenticationState): boolean => state.loading);
const loggedIn = createSelector(authenticationState, (state: AuthenticationState): boolean => state.loggedIn);
const error = createSelector(authenticationState, (state: AuthenticationState): ServerErrorInterface|null => state.error);

export const authenticationSelectors = {
  loading,
  loggedIn,
  error,
};
