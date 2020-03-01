import { Action, createReducer, on } from '@ngrx/store';

import { Viewports } from '../../shared/constants';
import { Device, Language, Locale, Viewport } from '../../shared/enums';
import { LayoutState } from './layout.state';
import { layoutActions } from './layout.actions';
import { authenticationActions } from '../authentication/authentication.actions';

const initialState = {
  language: Language.DEFAULT,
  locale: Locale.DEFAULT,
  timezone: 'UTC',
  viewport: Viewport.XL,
  device: Device.DESKTOP,
  desktop: true,
  tablet: false,
  mobile: false,
  anchor: null,
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
    layoutActions.changeLocalization,
    (state: LayoutState, { localization }): LayoutState => ({
      ...state,
      language: localization.language,
      locale: localization.locale,
      timezone: localization.timezone,
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
      };
    },
  ),
  on(
    layoutActions.scrollTo,
    (state: LayoutState, { anchor }): LayoutState => ({
      ...state,
      anchor,
    }),
  ),
  on(
    layoutActions.scrollToClear,
    (state: LayoutState): LayoutState => ({
      ...state,
      anchor: null,
    }),
  ),
  on(authenticationActions.logout, (): LayoutState => initialState),
);

export function layoutReducer(state: LayoutState, action: Action): LayoutState {
  return reducer(state, action);
}
