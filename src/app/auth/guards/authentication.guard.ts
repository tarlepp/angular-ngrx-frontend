import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'src/app/auth/services';
import { BaseAuth } from 'src/app/auth/guards/base-auth';

@Injectable()
export class AuthenticationGuard extends BaseAuth implements CanActivate, CanActivateChild {
  public constructor(protected router: Router, protected authenticationService: AuthenticationService) {
    super(router, authenticationService);
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.makeCheck(true);
  }

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.makeCheck(true);
  }
}
