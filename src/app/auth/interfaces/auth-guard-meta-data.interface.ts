/**
 * Interface for auth guard meta data, which is used on following guards within
 * this application;
 *  - AnonymousGuard
 *  - AuthenticationGuard
 *
 * With this you can change the guard behaviour by specified route `data`
 * property. For detailed information see `src/app/auth/guards/base-auth.ts`
 */
export interface AuthGuardMetaDataInterface {
  redirectIfMismatch: boolean;
  routeAuthenticated: string;
  routeNotAuthenticated: string;
}
