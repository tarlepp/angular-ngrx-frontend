import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { environment } from '../../environments/environment';
import { authenticationReducer } from './authentication';
import { AppState } from './app.state';

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  authentication: authenticationReducer,
};

export const metaReducers: MetaReducer<AppState>[] = environment.production ? [] : [];
