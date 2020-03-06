import { LayoutAction } from 'src/app/store/layout/layout.action';

export type LocalizationTypes =
  LayoutAction.CHANGE_LANGUAGE
  | LayoutAction.CHANGE_LOCALE
  | LayoutAction.CHANGE_TIMEZONE;
