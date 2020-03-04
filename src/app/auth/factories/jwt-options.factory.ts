import { JwtModuleOptions } from '@auth0/angular-jwt';
import { LocalStorageService } from 'ngx-webstorage';

import { ConfigurationService } from 'src/app/shared/services';

export function jwtOptionsFactory(localStorage: LocalStorageService): JwtModuleOptions['config'] {
  return {
    tokenGetter: (): any => localStorage.retrieve('token'),
    whitelistedDomains: [
      new URL(ConfigurationService.configuration.apiUrl).host,
    ],
    blacklistedRoutes: [
      ConfigurationService.configuration.tokenUrl,
    ],
  };
}
