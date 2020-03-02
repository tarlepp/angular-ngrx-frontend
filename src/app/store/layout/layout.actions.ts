import { createAction, props } from '@ngrx/store';

import { LayoutAction } from 'src/app/store/store.action';
import { Language, Viewport } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';

const changeLanguage = createAction(LayoutAction.CHANGE_LANGUAGE, props<{ language: Language }>());
const changeViewport = createAction(LayoutAction.CHANGE_VIEWPORT, props<{ viewport: Viewport }>());
const changeLocalization = createAction(LayoutAction.CHANGE_LOCALIZATION, props<{ localization: LocalizationInterface }>());
const scrollTo = createAction(LayoutAction.SCROLL_TO, props<{ anchor: string }>());
const scrollToTop = createAction(LayoutAction.SCROLL_TO_TOP);
const clearScrollTo = createAction(LayoutAction.CLEAR_SCROLL_TO);

export const layoutActions = {
  changeLanguage,
  changeViewport,
  changeLocalization,
  scrollTo,
  scrollToTop,
  clearScrollTo,
};
