/**
 * Interface for role guard meta data, which is used on following guards within
 * this application;
 *  - RoleAdminGuard
 *  - RoleALoggedGuard
 *  - RoleRootGuard
 *  - RoleUserGuard
 *
 * With this you can change the guard behaviour by specified route `data`
 * property. For detailed information and actual implementation you could
 * look `src/app/auth/guards/base-role.ts` file.
 *
 * redirect
 *  Should guard redirect user or not, defaults to true
 *
 * routeNotLoggedIn
 *  Route where to redirect if user is not logged in, defaults to `/auth/login`
 *
 * routeNoRole
 *  Route where to redirect user if he/she doesn't have specified role,
 *  defaults to `/`
 */
export interface RoleGuardMetaDataInterface {
  redirect: boolean;
  routeNotLoggedIn: string;
  routeNoRole: string;
}
