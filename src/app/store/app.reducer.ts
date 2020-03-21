import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { AppState } from 'src/app/store/app.state';
import { authenticationReducer, errorReducer, layoutReducer, versionReducer } from 'src/app/store/store-reducer';
import { environment } from 'src/environments/environment';

/**
 * Application NgRx reducers that we are using within this application. Each of
 * these reducers are imported from `store-reducer` barrel file.
 */
export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  authentication: authenticationReducer,
  error: errorReducer,
  layout: layoutReducer,
  version: versionReducer,
};

export const metaReducers: MetaReducer<AppState>[] = environment.production ? [] : [];
