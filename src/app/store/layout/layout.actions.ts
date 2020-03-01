import { createAction, props } from '@ngrx/store';

import { LayoutAction } from './layout.action';
import { Language, Viewport } from '../../shared/enums';
import { LocalizationInterface } from '../../shared/interfaces';

const changeLanguage = createAction(LayoutAction.CHANGE_LANGUAGE, props<{ language: Language }>());
const changeViewport = createAction(LayoutAction.CHANGE_VIEWPORT, props<{ viewport: Viewport }>());
const changeLocalization = createAction(LayoutAction.CHANGE_LOCALIZATION, props<{ localization: LocalizationInterface }>());
const scrollTo = createAction(LayoutAction.SCROLL_TO, props<{ anchor: string }>());
const scrollToTop = createAction(LayoutAction.SCROLL_TO_TOP);
const scrollToClear = createAction(LayoutAction.SCROLL_TO_CLEAR);

export const layoutActions = {
  changeLanguage,
  changeViewport,
  changeLocalization,
  scrollTo,
  scrollToTop,
  scrollToClear,
};
