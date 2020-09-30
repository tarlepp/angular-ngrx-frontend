import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { Role } from 'src/app/auth/enums';
import { authenticationSelectors } from 'src/app/store/store-selectors';
import { AuthenticationState } from 'src/app/store/store-states';

export abstract class BaseRole {
  /**
   * Constructor of the class. This is called from classes that extends this
   * abstract class.
   */
  protected constructor(protected router: Router, protected authenticationStore: Store<AuthenticationState>) { }

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
  protected checkRole(role: Role): Observable<boolean|UrlTree> {
    return combineLatest([
      this.authenticationStore.select(authenticationSelectors.loggedIn),
      this.authenticationStore.select(authenticationSelectors.roles),
    ])
    .pipe(
      take(1),
      switchMap(([loggedIn, roles]: [boolean, Array<Role>]): Observable<boolean|UrlTree> => {
        let output;

        if (loggedIn === false) {
          output = this.router.parseUrl('/auth/login');
        } else if (roles.includes(role) === false) {
          output = this.router.parseUrl('/');
        } else {
          output = true;
        }

        return of(output);
      }),
    );
  }
}
