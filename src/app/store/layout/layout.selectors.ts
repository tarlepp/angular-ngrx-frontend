import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Device, Language, Locale, Viewport } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';
import { LayoutState } from 'src/app/store';

/**
 * Selectors for `LayoutState` store.
 *
 * Simple usage example;
 *
 *  public constructor(private store: Store<AppState>) { }
 *
 *  public ngOnInit(): void {
 *    // Initialize `viewport$` and `device$` observables
 *    this.viewport$ = this.store.select(layoutSelectors.viewport);
 *    this.device$ = this.store.select(layoutSelectors.device);
 *  }
 */

// Feature selector for `layout` store
const layoutState = createFeatureSelector<LayoutState>('layout');

// Common selectors for this store
const language = createSelector(layoutState, (state: LayoutState): Language => state.language);
const locale = createSelector(layoutState, (state: LayoutState): Locale => state.locale);
const timezone = createSelector(layoutState, (state: LayoutState): string => state.timezone);
const viewport = createSelector(layoutState, (state: LayoutState): Viewport => state.viewport);
const device = createSelector(layoutState, (state: LayoutState): Device => state.device);
const isMobile = createSelector(layoutState, (state: LayoutState): boolean => state.isMobile);
const isTablet = createSelector(layoutState, (state: LayoutState): boolean => state.isTablet);
const isDesktop = createSelector(layoutState, (state: LayoutState): boolean => state.isDesktop);

/**
 * Selector for `localization` data, which contains;
 *  - locale
 *  - language
 *  - timezone
 */
const localization = createSelector(locale, language, timezone, (a: Locale,  b: Language, c: string): LocalizationInterface => ({
  locale: a,
  language: b,
  timezone: c,
}));

// Export all store selectors, so that those can be used easily.
export const layoutSelectors = {
  language,
  locale,
  timezone,
  viewport,
  device,
  isMobile,
  isTablet,
  isDesktop,
  localization,
};
