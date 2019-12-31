import { BaseRouterStoreState, RouterReducerState } from '@ngrx/router-store';

import { AuthenticationState } from './authentication';
import { ErrorState } from './error';

export interface AppState {
  router: RouterReducerState<BaseRouterStoreState>;
  authentication: AuthenticationState;
  error: ErrorState;
}
