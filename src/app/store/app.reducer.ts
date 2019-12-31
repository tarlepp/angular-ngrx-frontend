import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { environment } from '../../environments/environment';
import { authenticationReducer } from './authentication';
import { errorReducer } from './error';
import { AppState } from './app.state';

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  authentication: authenticationReducer,
  error: errorReducer,
};

export const metaReducers: MetaReducer<AppState>[] = environment.production ? [] : [];
