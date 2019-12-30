import { BaseRouterStoreState, RouterReducerState } from '@ngrx/router-store';

import { AuthenticationState } from './authentication';

export interface AppState {
  router: RouterReducerState<BaseRouterStoreState>;
  authentication: AuthenticationState;
}
