import { JwtModuleOptions } from '@auth0/angular-jwt';
import { LocalStorageService } from 'ngx-webstorage';

import { ConfigurationService } from 'src/app/shared/services';

/**
 * Function to determine Json Web Token module options according to our current
 * application configuration.
 */
export function jwtOptionsFactory(localStorage: LocalStorageService): JwtModuleOptions['config'] {
  return {
    tokenGetter: (): any => localStorage.retrieve('token'), // Get token from local storage
    whitelistedDomains: [ // White list our backend API host
      new URL(ConfigurationService.configuration.apiUrl).host,
    ],
    blacklistedRoutes: [ // Black list our auth token get route
      ConfigurationService.configuration.tokenUrl,
    ],
  };
}
