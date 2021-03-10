import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { Role } from 'src/app/auth/enums';
import { RoleGuardMetaDataInterface } from 'src/app/auth/interfaces';
import { authenticationSelectors } from 'src/app/store';

export abstract class BaseRole {
  /**
   * Constructor of the class. This is called from classes that extends this
   * abstract class.
   */
  protected constructor(protected router: Router, protected store: Store) { }

  /**
   * Helper method to make check if user has certain role or not. This is used
   * from following guards:
   *  - RoleAdminGuard
   *  - RoleALoggedGuard
   *  - RoleRootGuard
   *  - RoleUserGuard
   *
   * By default this method will redirect user either to `/` or `/auth/login`
   * depending if user is not logged in or user doesn't have the specified
   * role.
   *
   * You can override this behaviour by setting `data` option to your route
   * definition where you can configure following;
   *  - `redirect`, Redirect if not logged in or no role, defaults to true
   *  - `routeNotLoggedIn`, Not logged in route, defaults to '/auth/login'
   *  - `routeNoRole`, No specified role route, defaults to '/'
   *
   * Simple example about that route configuration;
   *
   *  export const FeatureRoutes: Routes = [
   *    {
   *      path: 'foo',
   *      canActivate: [
   *        RoleAdminGuard,
   *      ],
   *      component: FooComponent,
   *      data: {
   *        roleGuardMeta: {
   *          redirect: true,
   *          routeNotLoggedIn: '/some/route',
   *          routeNoRole: '/some/another/route',
   *        },
   *      },
   *    },
   *  ];
   *
   * Also note that you don't need to provide all those if you just need to
   * change one of those for your needs - and if the defaults are fine for your
   * use case then you don't need to specify that `roleGuardMeta` at all.
   */
  protected checkRole(role: Role, routeMetaData: RoleGuardMetaDataInterface|null): Observable<boolean|UrlTree> {
    const metaData: RoleGuardMetaDataInterface = {
      redirect: true,
      routeNotLoggedIn: '/auth/login',
      routeNoRole: '/',
      ...routeMetaData,
    };

    return combineLatest([
      this.store.select(authenticationSelectors.isLoggedIn),
      this.store.select(authenticationSelectors.roles),
    ])
    .pipe(
      take(1),
      map(([loggedIn, roles]: [boolean, Array<Role>]): boolean|UrlTree => {
        let output;

        if (loggedIn === false) {
          output = metaData.redirect ? this.router.parseUrl(metaData.routeNotLoggedIn) : false;
        } else if (roles.includes(role) === false) {
          output = metaData.redirect ? this.router.parseUrl(metaData.routeNoRole) : false;
        } else {
          output = true;
        }

        return output;
      }),
    );
  }
}
