import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LayoutState } from './layout.state';
import { Viewport } from '../../shared/enums';

const layoutState = createFeatureSelector<LayoutState>('layout');
const language = createSelector(layoutState, (state: LayoutState): string => state.language);
const viewport = createSelector(layoutState, (state: LayoutState): Viewport => state.viewport);

export const layoutSelectors = {
  language,
  viewport,
};
