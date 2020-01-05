import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LayoutState } from './layout.state';

const layoutState = createFeatureSelector<LayoutState>('layout');
const language = createSelector(layoutState, (state: LayoutState): string => state.language);

export const layoutSelectors = {
  language,
};
