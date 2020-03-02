import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { TypedAction } from '@ngrx/store/src/models';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, Observable, of } from 'rxjs';
import { catchError, map, pluck, switchMap } from 'rxjs/operators';

import { SnackbarService } from 'src/app/shared/services';
import { CredentialsRequestInterface, UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { AuthenticationService } from 'src/app/auth/services';
import { AuthenticationAction } from 'src/app/store/store.action';
import { authenticationActions, layoutActions } from 'src/app/store/store-actions';
import { AuthenticationLoginType, AuthenticationProfileType, LoginSuccessTypes } from 'src/app/store/store-types';
import { LocalizationInterface } from '../../shared/interfaces';

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
            map((userData: UserDataInterface): TypedAction<AuthenticationAction.LOGIN_SUCCESS> => {
              this.snackbarService
                .message(marker('messages.authentication.login'))
                .finally();

              this.router
                .navigate(['/'])
                .finally();

              return authenticationActions.loginSuccess({ userData });
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
  private loginSuccess$ = createEffect((): Observable<TypedAction<LoginSuccessTypes>> => this.actions$
    .pipe(
      ofType(AuthenticationAction.LOGIN_SUCCESS),
      pluck('userData'),
      map((userData: UserDataInterface): LocalizationInterface => userData.localization),
      switchMap((localization: LocalizationInterface): Array<TypedAction<LoginSuccessTypes>> => [
        authenticationActions.profile(),
        layoutActions.changeLocalization({ localization }),
      ]),
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
              authenticationActions.profileSuccess({ profile }),
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
