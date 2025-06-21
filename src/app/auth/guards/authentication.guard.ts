import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { BaseAuth } from 'src/app/auth/guards/base-auth';
import { AuthenticationService } from 'src/app/auth/services';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard extends BaseAuth {
  protected readonly router: Router = inject(Router);
  protected readonly authenticationService: AuthenticationService = inject(AuthenticationService);

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this guard.
   */
  public constructor() {
    const router: Router = inject(Router);
    const authenticationService: AuthenticationService = inject(AuthenticationService);

    super(router, authenticationService);
  }

  /**
   * Purpose of this guard is check that current user has been authenticated to
   * application. If user is not authenticated he/she is redirected to application
   * login page.
   *
   * This method is used within route definition `canActivate` definition.
   */
  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean|UrlTree> {
    return this.makeCheck(true, route.data?.authGuardMeta ?? null);
  }

  /**
   * Purpose of this guard is check that current user has been authenticated to
   * application. If user is not authenticated he/she is redirected to application
   * login page.
   *
   * This method is used within route definition `canActivateChild` definition.
   */
  public canActivateChild(childRoute: ActivatedRouteSnapshot): Observable<boolean|UrlTree> {
    return this.makeCheck(true, childRoute.data?.authGuardMeta ?? null);
  }
}
