import { createAction, props } from '@ngrx/store';

import { LayoutAction } from 'src/app/store/store.action';
import { Language, Locale, Viewport } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';

const changeLanguage = createAction(LayoutAction.CHANGE_LANGUAGE, props<{ language: Language }>());
const changeLocale = createAction(LayoutAction.CHANGE_LOCALE, props<{ locale: Locale }>());
const changeTimezone = createAction(LayoutAction.CHANGE_TIMEZONE, props<{ timezone: string }>());
const changeViewport = createAction(LayoutAction.CHANGE_VIEWPORT, props<{ viewport: Viewport }>());
const updateLocalization = createAction(LayoutAction.UPDATE_LOCALIZATION, props<{ localization: LocalizationInterface }>());
const scrollTo = createAction(LayoutAction.SCROLL_TO, props<{ anchor: string }>());
const scrollToTop = createAction(LayoutAction.SCROLL_TO_TOP);
const clearScrollTo = createAction(LayoutAction.CLEAR_SCROLL_TO);

export const layoutActions = {
  changeLanguage,
  changeLocale,
  changeTimezone,
  updateLocalization,
  changeViewport,
  scrollTo,
  scrollToTop,
  clearScrollTo,
};
