import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Device, Viewport } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';
import { LayoutState } from 'src/app/store/store-states';

const layoutState = createFeatureSelector<LayoutState>('layout');
const language = createSelector(layoutState, (state: LayoutState): string => state.language);
const locale = createSelector(layoutState, (state: LayoutState): string => state.locale);
const timezone = createSelector(layoutState, (state: LayoutState): string => state.timezone);
const localization = createSelector(layoutState, (state: LayoutState): LocalizationInterface => ({
  locale: state.locale,
  language: state.language,
  timezone: state.timezone,
} as LocalizationInterface));
const viewport = createSelector(layoutState, (state: LayoutState): Viewport => state.viewport);
const device = createSelector(layoutState, (state: LayoutState): Device => state.device);
const isMobile = createSelector(layoutState, (state: LayoutState): boolean => state.mobile);
const isTablet = createSelector(layoutState, (state: LayoutState): boolean => state.tablet);
const isDesktop = createSelector(layoutState, (state: LayoutState): boolean => state.desktop);

export const layoutSelectors = {
  language,
  locale,
  timezone,
  localization,
  viewport,
  device,
  isMobile,
  isTablet,
  isDesktop,
};
