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
    allowedDomains: [ // Allowed domains with Json Web Token
      new URL(ConfigurationService.configuration.apiUrl).host,
    ],
    disallowedRoutes: [ // Disallowed routes for Json Web Token
      ConfigurationService.configuration.tokenUrl,
    ],
  };
}
