import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthGuardMetaDataInterface } from 'src/app/auth/interfaces';
import { AuthenticationService } from 'src/app/auth/services';

export abstract class BaseAuth {
  private readonly router: Router = inject(Router);
  private readonly authenticationService: AuthenticationService = inject(AuthenticationService);

  /**
   * Helper method to make check if user needs to be authenticated or not. This
   * is used from following guards:
   *  - AnonymousGuard
   *  - AuthenticationGuard
   *
   * By default, this method will redirect user either to `/` or `/auth/login`
   * depending on if user needs to be authenticated or not.
   *
   * You can override this behaviour by setting `data` option to your route
   * definition where you can configure following;
   *  - Redirect if mismatch authentication, defaults to true
   *  - Authenticated route, defaults to '/'
   *  - Not authenticated route, defaults to '/auth/login'
   *
   * Simple example about that route configuration;
   *
   *  export const LoginRoutes: Routes = [
   *    {
   *      path: 'login',
   *      canActivate: [
   *        () => inject(AnonymousGuard).canActivate(inject(ActivatedRoute).snapshot),
   *      ],
   *      component: LoginComponent,
   *      data: {
   *        authGuardMeta: {
   *          redirectIfMismatch: true,
   *          routeAuthenticated: '/some/route',
   *          routeNotAuthenticated: '/some/another/route',
   *        },
   *      },
   *      children: [
   *        {
   *          path: '**',
   *          redirectTo: 'login',
   *        },
   *      ],
   *    },
   *  ];
   *
   * Also note that you don't need to provide all those if you just need to
   * change one of those for your needs.
   */
  protected makeCheck(
    needsToBeAuthenticated: boolean,
    routeMetaData: AuthGuardMetaDataInterface|null,
  ): Observable<boolean|UrlTree> {
    const metaData: AuthGuardMetaDataInterface = {
      redirectIfMismatch: true,
      routeAuthenticated: '/',
      routeNotAuthenticated: '/auth/login',
      ...routeMetaData,
    };

    return this.authenticationService
      .isAuthenticated()
      .pipe(
        take(1),
        map((authenticated: boolean): boolean|UrlTree =>
          (authenticated !== needsToBeAuthenticated && metaData.redirectIfMismatch)
            ? this.router.parseUrl(authenticated ? metaData.routeAuthenticated : metaData.routeNotAuthenticated)
            : authenticated === needsToBeAuthenticated,
        ),
      );
  }
}
