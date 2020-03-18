import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import localeFiExtra from '@angular/common/locales/extra/fi';
import localeFi from '@angular/common/locales/fi';

import { Locale } from 'src/app/shared/enums';

export const registerLocales = (): void => {
  registerLocaleData(localeEn, Locale.ENGLISH, localeEnExtra);
  registerLocaleData(localeFi, Locale.FINNISH, localeFiExtra);
};
