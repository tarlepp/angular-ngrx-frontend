import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { TypedAction } from '@ngrx/store/src/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, Observable, of } from 'rxjs';
import { catchError, map, pluck, switchMap } from 'rxjs/operators';

import { SnackbarService } from '../../shared/services';
import { AuthenticationActionType } from './authentication-action.type';
import { authenticationActions } from './authentication.actions';
import { AuthenticationService } from '../../auth/services';
import { CredentialsRequestInterface, UserProfileInterface } from '../../auth/interfaces';
import { Role } from '../../auth/enums';

@Injectable()
export class AuthenticationEffects {
  private login$ = createEffect((): Observable<TypedAction<AuthenticationActionType>> => this.actions$
    .pipe(
      ofType(AuthenticationActionType.LOGIN),
      pluck('credentials'),
      switchMap((credentials: CredentialsRequestInterface): Observable<TypedAction<AuthenticationActionType>> => {
        return from(this.authService.authenticate(credentials)
          .pipe(
            map((roles: Array<Role>): TypedAction<AuthenticationActionType.LOGIN_SUCCESS> => {
              this.snackbarService
                .message('You signed in')
                .finally();

              this.router
                .navigate(['/'])
                .finally();

              return authenticationActions.loginSuccess({roles});
            }),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<TypedAction<AuthenticationActionType.LOGIN_FAILURE>> =>
              of(authenticationActions.loginFailure({error: httpErrorResponse.error})),
            ),
          ),
        );
      }),
    ),
  );

  private loginSuccess$ = createEffect((): Observable<TypedAction<AuthenticationActionType>> => this.actions$
    .pipe(
      ofType(AuthenticationActionType.LOGIN_SUCCESS),
      switchMap((): Observable<TypedAction<AuthenticationActionType.PROFILE>> => of(authenticationActions.profile())),
    ),
  );

  private profile$ = createEffect((): Observable<TypedAction<AuthenticationActionType>> => this.actions$
    .pipe(
      ofType(AuthenticationActionType.PROFILE),
      switchMap((): Observable<TypedAction<AuthenticationActionType>> => {
        return from(this.authService.getProfile()
          .pipe(
            map((profile: UserProfileInterface): TypedAction<AuthenticationActionType.PROFILE_SUCCESS> =>
              authenticationActions.profileSuccess({profile}),
            ),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<TypedAction<AuthenticationActionType.PROFILE_FAILURE>> =>
              of(authenticationActions.profileFailure({error: httpErrorResponse.error})),
            ),
          ),
        );
      }),
    ),
  );

  private logout$ = createEffect((): Observable<void> => this.actions$
    .pipe(
      ofType(AuthenticationActionType.LOGOUT),
      pluck('message'),
      map((message?: string): void => {
        this.authService.logout();

        if (message) {
          this.snackbarService
            .message(message)
            .finally();
        }

        this.router
          .navigate(['/'])
          .finally();
      }),
    ),
    { dispatch: false },
  );

  public constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthenticationService,
    private snackbarService: SnackbarService,
  ) { }
}
