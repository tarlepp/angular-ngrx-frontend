import { Role } from 'src/app/auth/enums';
import { Observable, of } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AuthenticationState } from 'src/app/store/store-states';
import { authenticationSelectors } from 'src/app/store/authentication/authentication.selectors';
import { switchMap, take } from 'rxjs/operators';

export abstract class BaseRole {
  protected constructor(protected authenticationStore: Store<AuthenticationState>) { }

  protected checkRole(role: Role): Observable<boolean> {
    return this.authenticationStore
      .pipe(
        select(authenticationSelectors.roles),
        take(1),
        switchMap((roles: Array<Role>): Observable<boolean> => of(roles.includes(role))),
      );
  }
}
