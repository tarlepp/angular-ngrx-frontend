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

export const layoutActions = {
  changeLanguage,
  changeViewport,
};
