import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { environment } from '../../environments/environment';
import { authenticationReducer, errorReducer, layoutReducer } from './store-reducer';
import { AppState } from './app.state';

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  authentication: authenticationReducer,
  error: errorReducer,
  layout: layoutReducer,
};

export const metaReducers: MetaReducer<AppState>[] = environment.production ? [] : [];
