import { Language, Locale } from '../enums';

export interface LocalizationInterface {
  language: Language;
  locale: Locale;
  timezone: string;
}
