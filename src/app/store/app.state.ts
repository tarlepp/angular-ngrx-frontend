import { BaseRouterStoreState, RouterReducerState } from '@ngrx/router-store';

import { AuthenticationState } from './authentication';
import { ErrorState } from './error';
import { LayoutState } from './layout';

export interface AppState {
  router: RouterReducerState<BaseRouterStoreState>;
  authentication: AuthenticationState;
  error: ErrorState;
  layout: LayoutState;
}
