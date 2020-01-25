import { createAction, props } from '@ngrx/store';

import { LayoutActionType } from './layout-action.type';
import { Viewport } from '../../shared/enums';

const changeLanguage = createAction(
  LayoutActionType.CHANGE_LANGUAGE,
  props<{ language: string }>(),
);

const changeViewport = createAction(
  LayoutActionType.CHANGE_VIEWPORT,
  props<{ viewport: Viewport }>(),
);

const scrollTo = createAction(
  LayoutActionType.SCROLL_TO,
  props<{ anchor: string }>(),
);

const scrollToTop = createAction(LayoutActionType.SCROLL_TO_TOP);

export const layoutActions = {
  changeLanguage,
  changeViewport,
  scrollTo,
  scrollToTop,
};
