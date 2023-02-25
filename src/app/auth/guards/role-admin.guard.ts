import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Role } from 'src/app/auth/enums';
import { BaseRole } from 'src/app/auth/guards/base-role';

@Injectable({
  providedIn: 'root',
})
export class RoleAdminGuard extends BaseRole {
  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this guard.
   */
  public constructor(
    protected readonly router: Router,
    protected readonly store: Store,
  ) {
    super(router, store);
  }

  /**
   * Purpose of this guard is to check that user has `Role.ROLE_ADMIN` or not.
   * This method is used within route definition `canActivate` definition.
   */
  public canActivate(route: ActivatedRoute): Observable<boolean|UrlTree> {
    return this.checkRole(Role.ROLE_ADMIN, route.snapshot.data?.roleGuardMeta ?? null);
  }

  /**
   * Purpose of this guard is to check that user has `Role.ROLE_ADMIN` or not.
   * This method is used within route definition `canActivateChild` definition.
   */
  public canActivateChild(childRoute: ActivatedRoute): Observable<boolean|UrlTree> {
    return this.checkRole(Role.ROLE_ADMIN, childRoute.snapshot.data?.roleGuardMeta ?? null);
  }
}
