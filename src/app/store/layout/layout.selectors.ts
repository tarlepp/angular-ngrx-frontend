import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LayoutState } from './layout.state';
import { Device, Viewport } from '../../shared/enums';

const layoutState = createFeatureSelector<LayoutState>('layout');
const language = createSelector(layoutState, (state: LayoutState): string => state.language);
const viewport = createSelector(layoutState, (state: LayoutState): Viewport => state.viewport);
const device = createSelector(layoutState, (state: LayoutState): Device => state.device);
const isMobile = createSelector(layoutState, (state: LayoutState): boolean => state.mobile);
const isTablet = createSelector(layoutState, (state: LayoutState): boolean => state.tablet);
const isDesktop = createSelector(layoutState, (state: LayoutState): boolean => state.desktop);

export const layoutSelectors = {
  language,
  viewport,
  device,
  isMobile,
  isTablet,
  isDesktop,
};
