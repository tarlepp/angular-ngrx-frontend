import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TypedAction } from '@ngrx/store/src/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, Observable, of } from 'rxjs';
import { catchError, map, pluck, switchMap } from 'rxjs/operators';

import { SnackbarService } from '../../shared/services';
import { AuthenticationAction } from './authentication.action';
import { authenticationActions } from './authentication.actions';
import { AuthenticationLoginType, AuthenticationProfileType } from './authentication.types';
import { AuthenticationService } from '../../auth/services';
import { CredentialsRequestInterface, UserProfileInterface } from '../../auth/interfaces';
import { Role } from '../../auth/enums';

@Injectable()
export class AuthenticationEffects {
  // noinspection JSUnusedLocalSymbols
  private login$ = createEffect((): Observable<TypedAction<AuthenticationLoginType>> => this.actions$
    .pipe(
      ofType(AuthenticationAction.LOGIN),
      pluck('credentials'),
      switchMap((credentials: CredentialsRequestInterface): Observable<TypedAction<AuthenticationLoginType>> =>
        from(this.authService
          .authenticate(credentials)
          .pipe(
            map((roles: Array<Role>): TypedAction<AuthenticationAction.LOGIN_SUCCESS> => {
              this.snackbarService
                .message(marker('messages.authentication.login'))
                .finally();

              this.router
                .navigate(['/'])
                .finally();

              return authenticationActions.loginSuccess({roles});
            }),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<TypedAction<AuthenticationAction.LOGIN_FAILURE>> =>
              of(authenticationActions.loginFailure({ error: httpErrorResponse.error })),
            ),
          ),
        ),
      ),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  private loginSuccess$ = createEffect((): Observable<TypedAction<AuthenticationAction.PROFILE>> => this.actions$
    .pipe(
      ofType(AuthenticationAction.LOGIN_SUCCESS),
      switchMap((): Observable<TypedAction<AuthenticationAction.PROFILE>> => of(authenticationActions.profile())),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  private profile$ = createEffect((): Observable<TypedAction<AuthenticationProfileType>> => this.actions$
    .pipe(
      ofType(AuthenticationAction.PROFILE),
      switchMap((): Observable<TypedAction<AuthenticationProfileType>> =>
        from(this.authService.getProfile()
          .pipe(
            map((profile: UserProfileInterface): TypedAction<AuthenticationAction.PROFILE_SUCCESS> =>
              authenticationActions.profileSuccess({profile}),
            ),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<TypedAction<AuthenticationAction.PROFILE_FAILURE>> =>
              of(authenticationActions.profileFailure({ error: httpErrorResponse.error })),
            ),
          ),
        ),
      ),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  private logout$ = createEffect((): Observable<void> => this.actions$
    .pipe(
      ofType(AuthenticationAction.LOGOUT),
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
