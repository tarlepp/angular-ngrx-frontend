import { createFeatureSelector, createSelector } from '@ngrx/store';

import { Device, Language, Locale, Theme, Viewport } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';
import { LayoutState } from 'src/app/store';

/**
 * Selectors for `LayoutState` store.
 *
 * Simple usage example;
 *
 *  public constructor(private store: Store) {
 *    this.viewport$ = this.store.select(layoutSelectors.selectViewport);
 *    this.device$ = this.store.select(layoutSelectors.selectDevice);
 *  }
 */

// Feature selector for `layout` store
const selectFeature = createFeatureSelector<LayoutState>('layout');

// Common selectors for this store
const selectTheme = createSelector(selectFeature, (state: LayoutState): Theme => state.theme);
const selectLanguage = createSelector(selectFeature, (state: LayoutState): Language => state.language);
const selectLocale = createSelector(selectFeature, (state: LayoutState): Locale => state.locale);
const selectTimezone = createSelector(selectFeature, (state: LayoutState): string => state.timezone);
const selectViewport = createSelector(selectFeature, (state: LayoutState): Viewport => state.viewport);
const selectDevice = createSelector(selectFeature, (state: LayoutState): Device => state.device);
const selectIsMobile = createSelector(selectFeature, (state: LayoutState): boolean => state.isMobile);
const selectIsTablet = createSelector(selectFeature, (state: LayoutState): boolean => state.isTablet);
const selectIsDesktop = createSelector(selectFeature, (state: LayoutState): boolean => state.isDesktop);

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
  (locale: Locale,  language: Language, timezone: string): LocalizationInterface => ({
    locale,
    language,
    timezone,
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
