import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Device, Language, Locale, Theme, Viewport } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';
import { LayoutState } from 'src/app/store';

/**
 * Selectors for `LayoutState` store.
 *
 * Simple usage example;
 *
 *  public constructor(private store: Store) { }
 *
 *  public ngOnInit(): void {
 *    // Initialize `viewport$` and `device$` observables
 *    this.viewport$ = this.store.select(layoutSelectors.viewport);
 *    this.device$ = this.store.select(layoutSelectors.device);
 *  }
 */

// Feature selector for `layout` store
const selectFeatureSelector = createFeatureSelector<LayoutState>('layout');

// Common selectors for this store
const selectTheme = createSelector(selectFeatureSelector, (state: LayoutState): Theme => state.theme);
const selectLanguage = createSelector(selectFeatureSelector, (state: LayoutState): Language => state.language);
const selectLocale = createSelector(selectFeatureSelector, (state: LayoutState): Locale => state.locale);
const selectTimezone = createSelector(selectFeatureSelector, (state: LayoutState): string => state.timezone);
const selectViewport = createSelector(selectFeatureSelector, (state: LayoutState): Viewport => state.viewport);
const selectDevice = createSelector(selectFeatureSelector, (state: LayoutState): Device => state.device);
const selectIsMobile = createSelector(selectFeatureSelector, (state: LayoutState): boolean => state.isMobile);
const selectIsTablet = createSelector(selectFeatureSelector, (state: LayoutState): boolean => state.isTablet);
const selectIsDesktop = createSelector(selectFeatureSelector, (state: LayoutState): boolean => state.isDesktop);

/**
 * Selector for `localization` data, which contains;
 *  - locale
 *  - language
 *  - timezone
 */
const selectLocalization = createSelector(
  selectLocale,
  selectLanguage,
  selectTimezone,
  (a: Locale,  b: Language, c: string): LocalizationInterface => ({
    locale: a,
    language: b,
    timezone: c,
  }),
);

// Export all store selectors, so that those can be used easily.
export const layoutSelectors = {
  selectTheme,
  selectLanguage,
  selectLocale,
  selectTimezone,
  selectViewport,
  selectDevice,
  selectIsMobile,
  selectIsTablet,
  selectIsDesktop,
  selectLocalization,
};
