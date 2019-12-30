import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TypedAction } from '@ngrx/store/src/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, pluck, switchMap } from 'rxjs/operators';
import { from, of } from 'rxjs';

import { AuthenticationActionTypeEnum } from './authentication-action-type.enum';
import { authenticationActions } from './authentication.actions';
import { AuthenticationService } from '../../auth/services';
import { CredentialsRequestInterface } from '../../auth/interfaces';

@Injectable()
export class AuthenticationEffects {
  private login$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthenticationActionTypeEnum.LOGIN),
      pluck('credentials'),
      switchMap((credentials: CredentialsRequestInterface) => {
        return from(this.authService.authenticate(credentials)
          .pipe(
            map((roles: Array<string>): TypedAction<AuthenticationActionTypeEnum.LOGIN_SUCCESS> => {
              this.router
                .navigate(['/'])
                .finally();

              return authenticationActions.loginSuccess({ roles });
            }),
            catchError((httpErrorResponse: HttpErrorResponse) =>
              of(authenticationActions.loginFailure({ error: httpErrorResponse.error })),
            ),
          ),
        );
      }),
    ),
  );

  public constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthenticationService,
  ) { }
}
