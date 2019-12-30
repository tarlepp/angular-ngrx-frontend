import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TypedAction } from '@ngrx/store/src/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, pluck, switchMap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';

import { AuthenticationActionTypeEnum } from './authentication-action-type.enum';
import { authenticationActions } from './authentication.actions';
import { AuthenticationService } from '../../auth/services';
import { CredentialsRequestInterface, UserProfileInterface } from '../../auth/interfaces';

@Injectable()
export class AuthenticationEffects {
  private login$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthenticationActionTypeEnum.LOGIN),
      pluck('credentials'),
      switchMap((credentials: CredentialsRequestInterface): Observable<TypedAction<string>> => {
        return from(this.authService.authenticate(credentials)
          .pipe(
            map((roles: Array<string>): TypedAction<AuthenticationActionTypeEnum.LOGIN_SUCCESS> => {
              this.router
                .navigate(['/'])
                .finally();

              return authenticationActions.loginSuccess({roles});
            }),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<TypedAction<AuthenticationActionTypeEnum.LOGIN_FAILURE>> =>
              of(authenticationActions.loginFailure({error: httpErrorResponse.error})),
            ),
          ),
        );
      }),
    ),
  );

  private loginSuccess$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthenticationActionTypeEnum.LOGIN_SUCCESS),
      switchMap((): Observable<TypedAction<AuthenticationActionTypeEnum.PROFILE>> => of(authenticationActions.profile())),
    ),
  );

  private profile$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthenticationActionTypeEnum.PROFILE),
      switchMap((): Observable<TypedAction<string>> => {
        return from(this.authService.getProfile()
          .pipe(
            map((profile: UserProfileInterface): TypedAction<AuthenticationActionTypeEnum.PROFILE_SUCCESS> =>
              authenticationActions.profileSuccess({profile}),
            ),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<TypedAction<AuthenticationActionTypeEnum.PROFILE_FAILURE>> =>
              of(authenticationActions.profileFailure({error: httpErrorResponse.error})),
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
