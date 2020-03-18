import { Language, Locale } from 'src/app/shared/enums';

/**
 * Interface definition for user localization settings.
 *
 *  language
 *    User language - see `src/app/shared/enums/language.enum.ts` for
 *    possible values. This will affect to translations that we're using
 *    in application.
 *
 *  locale
 *    User language - see `src/app/shared/enums/locale.enum.ts` for
 *    possible values. This will affect number, date, etc. formatting
 *    in application.
 *
 *  timezone
 *    User timezone. This will affect to date, datetime formatting in
 *    application.
 */
export interface LocalizationInterface {
  language: Language;
  locale: Locale;
  timezone: string;
}
