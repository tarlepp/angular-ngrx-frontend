import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Role } from 'src/app/auth/enums';
import { BaseRole } from 'src/app/auth/guards/base-role';

@Injectable({
  providedIn: 'root',
})
export class RoleAdminGuard extends BaseRole {
  /**
   * Purpose of this guard is to check that user has `Role.ROLE_ADMIN` or not.
   * This method is used within route definition `canActivate` definition.
   */
  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean|UrlTree> {
    return this.checkRole(Role.ROLE_ADMIN, route.data?.roleGuardMeta ?? null);
  }

  /**
   * Purpose of this guard is to check that user has `Role.ROLE_ADMIN` or not.
   * This method is used within route definition `canActivateChild` definition.
   */
  public canActivateChild(childRoute: ActivatedRouteSnapshot): Observable<boolean|UrlTree> {
    return this.checkRole(Role.ROLE_ADMIN, childRoute.data?.roleGuardMeta ?? null);
  }
}
