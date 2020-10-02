import { routerReducer } from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { AppState } from 'src/app/store/app.state';
import { authenticationReducer } from 'src/app/store/authentication/authentication.reducer';
import { errorReducer } from 'src/app/store/error/error.reducer';
import { layoutReducer } from 'src/app/store/layout/layout.reducer';
import { versionReducer } from 'src/app/store/version/version.reducer';
import { environment } from 'src/environments/environment';

/**
 * Application NgRx reducers that we are using within this application.
 */
export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer,
  authentication: authenticationReducer,
  error: errorReducer,
  layout: layoutReducer,
  version: versionReducer,
};

export const metaReducers: MetaReducer<AppState>[] = environment.production ? [] : [];
