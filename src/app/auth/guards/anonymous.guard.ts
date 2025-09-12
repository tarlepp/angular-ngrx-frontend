import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { BaseAuth } from 'src/app/auth/guards/base-auth';

@Injectable({
  providedIn: 'root',
})
export class AnonymousGuard extends BaseAuth {
  /**
   * Purpose of this guard is check that current user has not been authenticated
   * to application. If user is authenticated he/she is redirected to application
   * root.
   *
   * This method is used within route definition `canActivate` definition.
   */
  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean|UrlTree> {
    return this.makeCheck(false, route.data?.authGuardMeta ?? null);
  }

  /**
   * Purpose of this guard is check that current user has not been authenticated
   * to application. If user is authenticated he/she is redirected to application
   * root.
   *
   * This method is used within route definition `canActivateChild` definition.
   */
  public canActivateChild(childRoute: ActivatedRouteSnapshot): Observable<boolean|UrlTree> {
    return this.makeCheck(false, childRoute.data?.authGuardMeta ?? null);
  }
}
