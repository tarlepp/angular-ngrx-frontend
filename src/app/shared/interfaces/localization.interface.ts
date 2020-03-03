import { Language, Locale } from 'src/app/shared/enums';

export interface LocalizationInterface {
  language: Language;
  locale: Locale;
  timezone: string;
}
