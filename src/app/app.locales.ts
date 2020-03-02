import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeEnExtra from '@angular/common/locales/extra/en';
import localeFi from '@angular/common/locales/fi';
import localeFiExtra from '@angular/common/locales/extra/fi';

import { Language } from 'src/app/shared/enums';

export const registerLocales = (): void => {
  registerLocaleData(localeEn, Language.ENGLISH, localeEnExtra);
  registerLocaleData(localeFi, Language.FINNISH, localeFiExtra);
};
