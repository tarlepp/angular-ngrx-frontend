import { BaseRouterStoreState, RouterReducerState } from '@ngrx/router-store';

import { AuthenticationState, ErrorState, LayoutState } from './store-states';

export interface AppState {
  router: RouterReducerState<BaseRouterStoreState>;
  authentication: AuthenticationState;
  error: ErrorState;
  layout: LayoutState;
}
