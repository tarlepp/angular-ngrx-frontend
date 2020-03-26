import { LayoutAction } from 'src/app/store/store.action';

/**
 * Combined types that are used within `Layout` store. These are used on
 * `effect` part of this store.
 */

export type LocalizationTypes =
  LayoutAction.CHANGE_LANGUAGE
  | LayoutAction.CHANGE_LOCALE
  | LayoutAction.CHANGE_TIMEZONE;
