import { Store, select } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Role } from 'src/app/auth/enums';
import { authenticationSelectors } from 'src/app/store/store-selectors';
import { AuthenticationState } from 'src/app/store/store-states';

export abstract class BaseRole {
  /**
   * Constructor of the class. This is called from classes that extends this
   * abstract class.
   */
  protected constructor(protected authenticationStore: Store<AuthenticationState>) { }

  /**
   * Helper method to make check if user has certain role or not. This is used
   * from following guards:
   *  - RoleAdminGuard
   *  - RoleALoggedGuard
   *  - RoleRootGuard
   *  - RoleUserGuard
   *
   * Method will redirect user either to `/` or `/auth/login` depending if user
   * needs to be authenticated or not.
   */
  protected checkRole(role: Role): Observable<boolean> {
    return this.authenticationStore
      .pipe(
        select(authenticationSelectors.roles),
        take(1),
        switchMap((roles: Array<Role>): Observable<boolean> => of(roles.includes(role))),
      );
  }
}
