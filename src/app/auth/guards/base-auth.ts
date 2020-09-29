import { Router, UrlTree } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/auth/services';

export abstract class BaseAuth {
  /**
   * Constructor of the class. This is called from classes that extends this
   * abstract class.
   */
  protected constructor(protected router: Router, protected authenticationService: AuthenticationService) { }

  /**
   * Helper method to make check if user needs to be authenticated or not. This
   * is used from following guards:
   *  - AnonymousGuard
   *  - AuthenticationGuard
   *
   * Method will redirect user either to `/` or `/auth/login` depending if user
   * needs to be authenticated or not.
   */
  protected makeCheck(needsToBeAuthenticated: boolean): Observable<boolean|UrlTree> {
    return new Observable((observer: Observer<boolean|UrlTree>): void => {
      this.authenticationService
        .isAuthenticated()
        .pipe(take(1))
        .subscribe((authenticated: boolean): void => {
          const output = (authenticated !== needsToBeAuthenticated)
            ? this.router.parseUrl(authenticated ? '/' : '/auth/login')
            : authenticated === needsToBeAuthenticated;

          observer.next(output);
          observer.complete();
        });
    });
  }
}
