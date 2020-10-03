import { AuthenticationEffects } from 'src/app/store/authentication/authentication.effects';
import { ErrorEffects } from 'src/app/store/error/error.effects';
import { LayoutEffects } from 'src/app/store/layout/layout.effects';
import { RouterEffects } from 'src/app/store/router/router.effects';
import { VersionEffects } from 'src/app/store/version/version.effects';

/**
 * Application NgRx effects that we using. These are used on main application
 * module definition.
 */
export const effects = [
  AuthenticationEffects,
  ErrorEffects,
  LayoutEffects,
  RouterEffects,
  VersionEffects,
];
