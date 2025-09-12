import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Role } from 'src/app/auth/enums';
import { RoleGuardMetaDataInterface } from 'src/app/auth/interfaces';
import { authenticationSelectors } from 'src/app/store';

export abstract class BaseRole {
  private readonly router: Router = inject(Router);
  private readonly store: Store = inject(Store);

  /**
   * Helper method to make check if user has certain role or not. This is used
   * from following guards:
   *  - RoleAdminGuard
   *  - RoleALoggedGuard
   *  - RoleRootGuard
   *  - RoleUserGuard
   *
   * By default, this method will redirect user either to `/` or `/auth/login`
   * depending on if user is not logged in or user doesn't have the specified
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
   *        () => inject(RoleAdminGuard).canActivate(inject(ActivatedRoute).snapshot),
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

    return this.store.select(authenticationSelectors.selectRoleGuard(role, metaData, this.router));
  }
}
