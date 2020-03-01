import { Device, Language, Locale, Viewport } from '../../shared/enums';

export interface LayoutState {
  language: Language;
  locale: Locale;
  timezone: string;
  viewport: Viewport;
  device: Device;
  desktop: boolean;
  tablet: boolean;
  mobile: boolean;
  anchor: string|null;
}
