import { Action, createReducer, on } from '@ngrx/store';

import { LayoutState } from './layout.state';
import { Language } from '../../shared/enums';
import { layoutActions } from './layout.actions';

const initialState = {
  language: '',
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
);

export function layoutReducer(state: LayoutState|undefined, action: Action): LayoutState {
  return reducer(state, action);
}
