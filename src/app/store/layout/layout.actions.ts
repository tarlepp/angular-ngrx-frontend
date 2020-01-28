import { createAction, props } from '@ngrx/store';

import { LayoutAction } from './layout.action';
import { Viewport } from '../../shared/enums';

const changeLanguage = createAction(LayoutAction.CHANGE_LANGUAGE, props<{ language: string }>());
const changeViewport = createAction(LayoutAction.CHANGE_VIEWPORT, props<{ viewport: Viewport }>());
const scrollTo = createAction(LayoutAction.SCROLL_TO, props<{ anchor: string }>());
const scrollToTop = createAction(LayoutAction.SCROLL_TO_TOP);

export const layoutActions = {
  changeLanguage,
  changeViewport,
  scrollTo,
  scrollToTop,
};
