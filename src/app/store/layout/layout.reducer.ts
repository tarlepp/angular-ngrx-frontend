import { Action, createReducer, on } from '@ngrx/store';
import * as moment from 'moment-timezone';

import { viewports } from 'src/app/shared/constants';
import { Device, Language, Locale, Theme, Viewport } from 'src/app/shared/enums';
import {
  LanguageValueInterface,
  LocaleValueInterface,
  ThemeValueInterface,
  ViewportValueInterface,
} from 'src/app/shared/interfaces';
import { LayoutState, layoutActions } from 'src/app/store';

// Initial state of `Layout` store.
const initialState: LayoutState = {
  theme: Theme.DEFAULT,
  language: Language.DEFAULT,
  locale: Locale.DEFAULT,
  timezone: 'UTC',
  viewport: Viewport.XL,
  device: Device.DESKTOP,
  isDesktop: true,
  isTablet: false,
  isMobile: false,
  anchor: null,
};

const reducer = createReducer(
  initialState,
  on(
    layoutActions.setTheme,
    (state: LayoutState, { theme }: ThemeValueInterface): LayoutState => ({
      ...state,
      theme,
    }),
  ),
  /**
   * Reducer for `layoutActions.changeLanguage` action. Within this reducer we
   * check that given `language` is valid one and if not fallback to `default`
   * language and then store that normalized language to this state.
   */
  on(
    layoutActions.changeLanguage,
    (state: LayoutState, { language }: LanguageValueInterface): LayoutState => ({
      ...state,
      language: Object.values(Language).includes(language) ? language : Language.DEFAULT,
    }),
  ),
  /**
   * Reducer for `layoutActions.changeLocale` action. Within this reducer we
   * check that given `locale` is valid one and if not fallback to `default`
   * locale and then store that normalized locale to this state.
   */
  on(
    layoutActions.changeLocale,
    (state: LayoutState, { locale }: LocaleValueInterface): LayoutState => ({
      ...state,
      locale: Object.values(Locale).includes(locale) ? locale : Locale.DEFAULT,
    }),
  ),
  /**
   * Reducer for `layoutActions.changeTimezone` action. Within this reducer we
   * check that given `timezone` is valid one and if not fallback to `default`
   * which is `Europe/Helsinki` and then store that normalized timezone to this
   * state.
   */
  on(
    layoutActions.changeTimezone,
    (state: LayoutState, { timezone }: { timezone: string }): LayoutState => ({
      ...state,
      timezone: moment.tz.names().includes(timezone) ? timezone : 'Europe/Helsinki',
    }),
  ),
  /**
   * Reducer for `layoutActions.changeViewport` action. Within this reducer we
   * are actually updating multiple properties of this state;
   *  - viewport, see src/app/shared/enums/viewport.enum.ts
   *  - device, according to src/app/shared/constants/viewports.constant.ts
   *  - desktop
   *  - tablet
   *  - mobile
   *
   * Note that only one (1) of those last three can be `true`.
   */
  on(
    layoutActions.changeViewport,
    (state: LayoutState, { viewport }: ViewportValueInterface): LayoutState => {
      const device = viewports[Device.MOBILE].includes(viewport)
        ? Device.MOBILE
        : viewports[Device.TABLET].includes(viewport)
          ? Device.TABLET
          : Device.DESKTOP;

      return {
        ...state,
        viewport,
        device,
        isDesktop: device === Device.DESKTOP,
        isTablet: device === Device.TABLET,
        isMobile: device === Device.MOBILE,
      };
    },
  ),
  // Reducer for `layoutActions.scrollTo` action to store anchor to this state.
  on(
    layoutActions.scrollTo,
    (state: LayoutState, { anchor }: { anchor: string }): LayoutState => ({
      ...state,
      anchor,
    }),
  ),
  /**
   * Reducer for `layoutActions.clearScrollTo` action to clear anchor from this
   * state.
   */
  on(
    layoutActions.clearScrollTo,
    (state: LayoutState): LayoutState => ({
      ...state,
      anchor: null,
    }),
  ),
);

// Export error `Layout` store reducer.
export const layoutReducer = (state: LayoutState|undefined, action: Action): LayoutState => reducer(state, action);
