import { Action, createReducer, on } from '@ngrx/store';

import { MobileViewports } from '../../shared/constants';
import { Language } from '../../shared/enums';
import { LayoutState } from './layout.state';
import { layoutActions } from './layout.actions';

const initialState = {
  language: null,
  viewport: null,
  mobile: false,
} as LayoutState;

const reducer = createReducer(
  initialState,
  on(
    layoutActions.changeLanguage,
    (state: LayoutState, { language }): LayoutState => ({
      ...state,
      language: Object.values(Language).includes(language) ? language : Language.DEFAULT,
    }),
  ),
  on(
    layoutActions.changeViewport,
    (state: LayoutState, { viewport }): LayoutState => ({
      ...state,
      viewport,
      mobile: MobileViewports.includes(viewport),
    }),
  ),
);

export function layoutReducer(state: LayoutState|undefined, action: Action): LayoutState {
  return reducer(state, action);
}
