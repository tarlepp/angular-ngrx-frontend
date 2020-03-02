import { Action, createReducer, on } from '@ngrx/store';

import { Viewports } from 'src/app/shared/constants';
import { Device, Language, Locale, Viewport } from 'src/app/shared/enums';
import { LayoutState } from 'src/app/store/store-states';
import { layoutActions } from 'src/app/store/store-actions';

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
      language: Object.values(Language).includes(localization.language) ? localization.language : Language.DEFAULT,
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
    layoutActions.clearScrollTo,
    (state: LayoutState): LayoutState => ({
      ...state,
      anchor: null,
    }),
  ),
);

export function layoutReducer(state: LayoutState, action: Action): LayoutState {
  return reducer(state, action);
}
