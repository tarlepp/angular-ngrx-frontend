import { Action, createReducer, on } from '@ngrx/store';

import { Viewports } from '../../shared/constants';
import { Device, Language } from '../../shared/enums';
import { LayoutState } from './layout.state';
import { layoutActions } from './layout.actions';

const initialState = {
  language: null,
  viewport: null,
  device: null,
  desktop: false,
  tablet: false,
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
    (state: LayoutState, { viewport }): LayoutState => {
      const device = Viewports[Device.MOBILE].includes(viewport)
        ? Device.MOBILE
        : Viewports[Device.TABLET].includes(viewport)
          ? Device.TABLET
          : Device.DESKTOP;

      return {
        ...state,
        viewport,
        device,
        desktop: device === Device.DESKTOP,
        tablet: device === Device.TABLET,
        mobile: device === Device.MOBILE,
      }
    },
  ),
);

export function layoutReducer(state: LayoutState|undefined, action: Action): LayoutState {
  return reducer(state, action);
}
