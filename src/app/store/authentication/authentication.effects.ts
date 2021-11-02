import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { from, Observable, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, pluck, switchMap, tap } from 'rxjs/operators';

import { CredentialsRequestInterface, UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { AuthenticationService } from 'src/app/auth/services';
import { SnackbarService } from 'src/app/shared/services';
import {
  authenticationActions,
  AuthenticationLoginSuccessTypes,
  AuthenticationLoginTypes,
  AuthenticationProfileTypes,
  AuthenticationType,
  layoutActions,
  versionActions,
  VersionType,
} from 'src/app/store';

@Injectable()
export class AuthenticationEffects {
  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `authenticationActions.login` action, so that we're
   * actually making that login HTTP request to our backend and catch possible
   * errors within that request.
   *
   * If the login request is successfully this effect will trigger following
   * store actions;
   *  - layoutActions.updateLocalization
   *  - authenticationActions.loginSuccess
   *
   * First one of these will update application localization data so that user
   * will see correct translations etc. within application.
   *
   * Second one will trigger user profile loading, that information is used to
   * show some user related messages, etc. in application.
   */
  private loginEffect$: Observable<TypedAction<AuthenticationLoginTypes>> = createEffect(
    (): Observable<TypedAction<AuthenticationLoginTypes>> => this.actions$.pipe(
      ofType(authenticationActions.login),
      pluck('credentials'),
      exhaustMap((credentials: CredentialsRequestInterface): Observable<TypedAction<AuthenticationLoginTypes>> =>
        from(this.authService
          .authenticate(credentials)
          .pipe(
            map((userData: UserDataInterface): TypedAction<AuthenticationType.LOGIN_SUCCESS> =>
              authenticationActions.loginSuccess({ userData }),
            ),
            tap((): void => {
              this.snackbarService
                .message(marker('messages.authentication.login'))
                .finally();

              this.router
                .navigate(['/'])
                .finally();
            }),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<TypedAction<AuthenticationType.LOGIN_FAILURE>> =>
              of(authenticationActions.loginFailure({ error: httpErrorResponse.error })),
            ),
          ),
        ),
      ),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect that is triggered when `authenticationActions.loginSuccess`
   * action happens in application lifecycle. This will trigger to fetch user
   * profile information from backend.
   *
   * This effect will be also triggered if/when user reloads application page
   * manually if user token that is stored to local storage is valid one.
   */
  private loginSuccessEffect$: Observable<TypedAction<AuthenticationLoginSuccessTypes>> = createEffect(
    (): Observable<TypedAction<AuthenticationLoginSuccessTypes>> => this.actions$.pipe(
      ofType(authenticationActions.loginSuccess),
      pluck('userData'),
      mergeMap((userData: UserDataInterface): Array<TypedAction<AuthenticationLoginSuccessTypes>> => [
        layoutActions.updateLocalization({ localization: userData.localization }),
        authenticationActions.profile(),
      ]),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect to handle `authenticationActions.profile` action effect,
   * within this we want to actually fetch user profile information from
   * backend and catch possible errors while fetching that information.
   */
  private profileEffect$: Observable<TypedAction<AuthenticationProfileTypes>> = createEffect(
    (): Observable<TypedAction<AuthenticationProfileTypes>> => this.actions$.pipe(
      ofType(authenticationActions.profile),
      switchMap((): Observable<TypedAction<AuthenticationProfileTypes>> =>
        from(this.authService.getProfile()
          .pipe(
            map((profile: UserProfileInterface): TypedAction<AuthenticationType.PROFILE_SUCCESS> =>
              authenticationActions.profileSuccess({ profile }),
            ),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<TypedAction<AuthenticationType.PROFILE_FAILURE>> =>
              of(authenticationActions.profileFailure({ error: httpErrorResponse.error })),
            ),
          ),
        ),
      ),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect that is triggered within `authenticationActions.logout`
   * action. Within this event we need to do following;
   *  1) Logout user properly - see `AuthenticationService` for details
   *  2) Show possible logout message, this one is not needed
   *  3) Redirect user back to application main route
   *  4) Trigger frontend version fetch, because user might be logout
   *     from application just because backend version has been changed.
   */
  private logoutEffect$: Observable<TypedAction<VersionType.FETCH_FRONTEND_VERSION>> = createEffect(
    (): Observable<TypedAction<VersionType.FETCH_FRONTEND_VERSION>> => this.actions$.pipe(
      ofType(authenticationActions.logout),
      pluck('message'),
      tap((message: string|null): void => {
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
      map((): TypedAction<VersionType.FETCH_FRONTEND_VERSION> => versionActions.fetchFrontendVersion()),
    ),
  );

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly authService: AuthenticationService,
    private readonly snackbarService: SnackbarService,
  ) {
  }
}
