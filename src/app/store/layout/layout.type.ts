// Layout store action definitions.
export enum LayoutType {
  CHANGE_LANGUAGE     = '[Layout] Change language',
  CHANGE_LOCALE       = '[Layout] Change locale',
  CHANGE_TIMEZONE     = '[Layout] Change timezone',
  UPDATE_LOCALIZATION = '[Layout] Update localization',
  CHANGE_VIEWPORT     = '[Layout] Change viewport',
  SCROLL_TO           = '[Layout] Scroll to anchor',
  SCROLL_TO_TOP       = '[Layout] Scroll to top of the page',
  CLEAR_SCROLL_TO     = '[Layout] Clear scroll to',
}

export type LocalizationTypes =
  LayoutType.CHANGE_LANGUAGE
  | LayoutType.CHANGE_LOCALE
  | LayoutType.CHANGE_TIMEZONE;
