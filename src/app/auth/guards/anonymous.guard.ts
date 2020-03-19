import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { BaseAuth } from 'src/app/auth/guards/base-auth';
import { AuthenticationService } from 'src/app/auth/services';

@Injectable()
export class AnonymousGuard extends BaseAuth implements CanActivate, CanActivateChild {
  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this guard.
   */
  public constructor(protected router: Router, protected authenticationService: AuthenticationService) {
    super(router, authenticationService);
  }

  /**
   * Purpose of this guard is check that current user has not been authenticated
   * to application. If user is authenticated he/she is redirected to application
   * root.
   *
   * This method is used within route definition `canActivate` definition.
   */
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.makeCheck(false);
  }

  /**
   * Purpose of this guard is check that current user has not been authenticated
   * to application. If user is authenticated he/she is redirected to application
   * root.
   *
   * This method is used within route definition `canActivateChild` definition.
   */
  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.makeCheck(false);
  }
}
