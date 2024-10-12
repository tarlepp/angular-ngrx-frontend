import { TranslocoGlobalConfig } from '@jsverse/transloco-utils';

//import { languages } from './src/app/shared/constants';

const config: TranslocoGlobalConfig = {
  rootTranslationsPath: 'src/assets/i18n/',
  langs: ['fi', 'en'],
  keysManager: {
    addMissingKeys: true,
    //defaultValue: undefined,
  },
};

export default config;

