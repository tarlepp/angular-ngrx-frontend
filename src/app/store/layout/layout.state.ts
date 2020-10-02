import { Device, Language, Locale, Viewport } from 'src/app/shared/enums';

/**
 * Interface definition for our layout store contents.
 *
 *  language
 *    Current language that is used within application, this will affect all
 *    messages within our application.
 *
 *  locale
 *    Current locale that is used within application, this will affect to
 *    time, date, datetime, number and currency formatting.
 *
 *  timezone
 *    Current timezone that is used within application, this will affect to
 *    time, date and datetime formatting.
 *
 *  viewport
 *    Current viewport definition of user browser who is using application.
 *
 *  device
 *    Current device definition of user browser who is using application.
 *
 *  isDesktop
 *    Is user using this application with desktop device or not.
 *
 *  isTablet
 *    Is user using this application with tablet device or not.
 *
 *  isMobile
 *    Is user using this application with mobile device or not.
 *
 *  anchor
 *    HTML anchor definition where we want to scroll user browser.
 */
export interface LayoutState {
  language: Language;
  locale: Locale;
  timezone: string;
  viewport: Viewport;
  device: Device;
  isDesktop: boolean;
  isTablet: boolean;
  isMobile: boolean;
  anchor: string|null;
}
