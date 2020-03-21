import { AuthenticationEffects, ErrorEffects, LayoutEffects, VersionEffects } from 'src/app/store/store-effects';

/**
 * Application NgRx effects that we using. Each one of these are imported from
 * `store-effects` barrel where those are exported from proper places.
 */
export const effects = [
  AuthenticationEffects,
  ErrorEffects,
  LayoutEffects,
  VersionEffects,
];
