import { BaseRouterStoreState, RouterReducerState } from '@ngrx/router-store';

import { AuthenticationState, ErrorState, LayoutState, VersionState } from 'src/app/store/store-states';

/**
 * Application NgRx main state.
 */
export interface AppState {
  router: RouterReducerState<BaseRouterStoreState>;
  authentication: AuthenticationState;
  error: ErrorState;
  layout: LayoutState;
  version: VersionState;
}
