import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Device, Viewport } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';
import { LayoutState } from 'src/app/store/store-states';

/**
 * Selectors for `LayoutState` store.
 *
 * Simple usage example;
 *
 *  public constructor(private layoutStore: Store<LayoutState>) { }
 *
 *  public ngOnInit(): void {
 *    // Initialize `viewport$` and `device$` observables
 *    this.viewport$ = this.layoutStore.select(layoutSelectors.viewport);
 *    this.device$ = this.layoutStore.select(layoutSelectors.device);
 *  }
 */

// Feature selector for `layout` store
const layoutState = createFeatureSelector<LayoutState>('layout');

// Selector for language
const language = createSelector(layoutState, (state: LayoutState): string => state.language);

// Selector for locale
const locale = createSelector(layoutState, (state: LayoutState): string => state.locale);

// Selector for timezone
const timezone = createSelector(layoutState, (state: LayoutState): string => state.timezone);

/**
 * Selector for `localization` data, which contains;
 *  - locale
 *  - language
 *  - timezone
 */
const localization = createSelector(layoutState, (state: LayoutState): LocalizationInterface => ({
  locale: state.locale,
  language: state.language,
  timezone: state.timezone,
}));

// Selector for viewport
const viewport = createSelector(layoutState, (state: LayoutState): Viewport => state.viewport);

// Selector for device
const device = createSelector(layoutState, (state: LayoutState): Device => state.device);

// Selector for mobile
const isMobile = createSelector(layoutState, (state: LayoutState): boolean => state.mobile);

// Selector for tablet
const isTablet = createSelector(layoutState, (state: LayoutState): boolean => state.tablet);

// Selector for desktop
const isDesktop = createSelector(layoutState, (state: LayoutState): boolean => state.desktop);

// Export all store selectors, so that those can be used easily.
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
