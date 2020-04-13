import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, from, of } from 'rxjs';
import { catchError, map, mergeMap, pluck, switchMap } from 'rxjs/operators';

import { CredentialsRequestInterface, UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { AuthenticationService } from 'src/app/auth/services';
import { SnackbarService } from 'src/app/shared/services';
import { authenticationActions, layoutActions, versionActions } from 'src/app/store/store-actions';
import { AuthenticationLoginType, AuthenticationProfileType } from 'src/app/store/store-types';
import { AuthenticationAction, VersionAction } from 'src/app/store/store.action';

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
  private login$: Observable<TypedAction<AuthenticationLoginType>> = createEffect(
    (): Observable<TypedAction<AuthenticationLoginType>> => this.actions$
    .pipe(
      ofType(authenticationActions.login),
      pluck('credentials'),
      switchMap((credentials: CredentialsRequestInterface): Observable<TypedAction<AuthenticationLoginType>> =>
        from(this.authService
          .authenticate(credentials)
          .pipe(
            mergeMap((userData: UserDataInterface): Array<TypedAction<AuthenticationLoginType>> => {
              this.snackbarService
                .message(marker('messages.authentication.login'))
                .finally();

              this.router
                .navigate(['/'])
                .finally();

              return [
                layoutActions.updateLocalization({ localization: userData.localization }),
                authenticationActions.loginSuccess({ userData }),
              ];
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
  /**
   * NgRx effect that is triggered when `authenticationActions.loginSuccess`
   * action happens in application lifecycle. This will trigger to fetch user
   * profile information from backend.
   *
   * This effect will be also triggered if/when user reloads application page
   * manually if user token that is stored to local storage is valid one.
   */
  private loginSuccess$: Observable<TypedAction<AuthenticationAction.PROFILE>> = createEffect(
    (): Observable<TypedAction<AuthenticationAction.PROFILE>> => this.actions$
    .pipe(
      ofType(authenticationActions.loginSuccess),
      switchMap((): Observable<TypedAction<AuthenticationAction.PROFILE>> => of(authenticationActions.profile())),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect to handle `authenticationActions.profile` action effect,
   * within this we want to actually fetch user profile information from
   * backend and catch possible errors while fetching that information.
   */
  private profile$: Observable<TypedAction<AuthenticationProfileType>> = createEffect(
    (): Observable<TypedAction<AuthenticationProfileType>> => this.actions$
    .pipe(
      ofType(authenticationActions.profile),
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
  /**
   * NgRx effect that is triggered within `authenticationActions.logout`
   * action. Within this event we need to do following;
   *  1) Logout user properly - see `AuthenticationService` for details
   *  2) Show possible logout message, this one is not needed
   *  3) Redirect user back to application main route
   *  4) Trigger frontend version fetch, because user might be logout
   *     from application just because backend version has been changed.
   *
   * Within this effect we won't dispatch any other store actions.
   */
  private logout$: Observable<TypedAction<VersionAction.FETCH_FRONTEND_VERSION>> = createEffect(
    (): Observable<TypedAction<VersionAction.FETCH_FRONTEND_VERSION>> => this.actions$
    .pipe(
      ofType(authenticationActions.logout),
      pluck('message'),
      map((message?: string): TypedAction<VersionAction.FETCH_FRONTEND_VERSION> => {
        this.authService.logout();

        if (message) {
          this.snackbarService
            .message(message)
            .finally();
        }

        this.router
          .navigate(['/'])
          .finally();

        return versionActions.fetchFrontendVersion();
      }),
    ),
  );

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private actions$: Actions,
    private router: Router,
    private authService: AuthenticationService,
    private snackbarService: SnackbarService,
  ) { }
}
