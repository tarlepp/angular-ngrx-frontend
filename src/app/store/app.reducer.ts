import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { routerReducer } from '@ngrx/router-store';

import { environment } from 'src/environments/environment';
import { authenticationReducer, errorReducer, layoutReducer } from 'src/app/store/store-reducer';
import { AppState } from 'src/app/store/app.state';

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  authentication: authenticationReducer,
  error: errorReducer,
  layout: layoutReducer,
};

export const metaReducers: MetaReducer<AppState>[] = environment.production ? [] : [];
