import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services';
import { BaseGuard } from './base.guard';

@Injectable()
export class AnonymousGuard extends BaseGuard implements CanActivate, CanActivateChild {
  public constructor(protected router: Router, protected authenticationService: AuthenticationService) {
    super(router, authenticationService);
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.makeCheck(false);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.makeCheck(false);
  }
}
