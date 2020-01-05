import { createAction, props } from '@ngrx/store';

import { LayoutActionType } from './layout-action.type';

const changeLanguage = createAction(
  LayoutActionType.CHANGE_LANGUAGE,
  props<{ language: string }>(),
);

export const layoutActions = {
  changeLanguage,
};
