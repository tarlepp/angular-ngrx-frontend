import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthenticationService } from '../services';

export class BaseGuard {
  protected constructor(protected router: Router, protected authenticationService: AuthenticationService) { }

  protected makeCheck(needsToBeAuthenticated: boolean): Observable<boolean> {
    return new Observable((observer: Observer<boolean>): void => {
      this.authenticationService
        .isAuthenticated()
        .pipe(take(1))
        .subscribe((authenticated: boolean): void => {
          observer.next(authenticated);

          if (authenticated !== needsToBeAuthenticated) {
            this.router
              .navigate(authenticated ? ['/'] : ['/auth/login'])
              .finally();
          }

          observer.complete();
        });
    });
  }
}
