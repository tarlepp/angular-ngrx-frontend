/**
 * Interface definition for our application configuration which is initialized
 * before Angular itself is bootstrapped so that we can rely that we have all
 * configuration values initialized.
 *
 * See `/src/assets/config/config.*.json` files to see what those configuration
 * values actually are.
 *
 *  apiUrl
 *    Backend API url, eg. https://api.somedomain.tld
 *
 *  tokenUrl
 *    Backend API url where Json WebToken (JWT) can be obtained
 */
export interface ApplicationConfigurationInterface {
  apiUrl: string;
  tokenUrl: string;
}
