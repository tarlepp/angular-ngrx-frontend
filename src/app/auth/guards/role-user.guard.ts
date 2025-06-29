import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Role } from 'src/app/auth/enums';
import { BaseRole } from 'src/app/auth/guards/base-role';

@Injectable({
  providedIn: 'root',
})
export class RoleUserGuard extends BaseRole {
  protected readonly router: Router = inject(Router);
  protected readonly store: Store = inject(Store);

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this guard.
   */
  public constructor() {
    const router: Router = inject(Router);
    const store: Store = inject(Store);

    super(router, store);
  }

  /**
   * Purpose of this guard is to check that user has `Role.ROLE_USER` or not.
   * This method is used within route definition `canActivate` definition.
   */
  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean|UrlTree> {
    return this.checkRole(Role.ROLE_USER, route.data?.roleGuardMeta ?? null);
  }

  /**
   * Purpose of this guard is to check that user has `Role.ROLE_USER` or not.
   * This method is used within route definition `canActivateChild` definition.
   */
  public canActivateChild(childRoute: ActivatedRouteSnapshot): Observable<boolean|UrlTree> {
    return this.checkRole(Role.ROLE_USER, childRoute.data?.roleGuardMeta ?? null);
  }
}
