import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable, Observer, of } from 'rxjs';
import { map, take } from 'rxjs/operators';

import {
  CredentialsRequestInterface,
  CredentialsResponseInterface,
  UserDataInterface,
  UserProfileInterface,
} from 'src/app/auth/interfaces';
import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { ConfigurationService } from 'src/app/shared/services';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly localStorage: LocalStorageService = inject(LocalStorageService);
  private readonly jwtHelper: JwtHelperService = new JwtHelperService();
  private readonly userData$: BehaviorSubject<UserDataInterface|null> = new BehaviorSubject<UserDataInterface|null>(null);

  /**
   * Method to make user login request to backend API endpoint. This method
   * will store response Json Web Token (JWT) to local storage and dispatch
   * new value to `userData$` observable stream if/when request was ok.
   *
   * Otherwise, method will clear that `token` from local storage and dispatch
   * error to `userData$` observable stream.
   */
  public authenticate(credentials: CredentialsRequestInterface): Observable<UserDataInterface> {
    return new Observable((observer: Observer<UserDataInterface>): void => {
      this.http
        .post(ConfigurationService.configuration.tokenUrl, credentials)
        .pipe(
          take(1),
          map((response: unknown): CredentialsResponseInterface => response as CredentialsResponseInterface),
        )
        .subscribe({
          next: (token: CredentialsResponseInterface): void => {
            this.localStorage.store('token', token.token);

            observer.next(this.getUserData(token.token));
          },
          error: (error: ServerErrorInterface): void => {
            this.localStorage.clear('token');

            observer.error(error);
          },
          complete: (): void => observer.complete(),
        });
    });
  }

  /**
   * Method to fetch logged in user profile from backend API endpoint. This
   * method is called via `Authentication` store effect when below action is
   * dispatched:
   *  - AuthenticationAction.PROFILE
   *
   * This action is dispatched on successfully login and if user refresh page
   * and he/she is already logged in to application.
   */
  public getProfile(): Observable<UserProfileInterface> {
    const url = ConfigurationService.configuration.apiUrl + '/v1/profile';

    return new Observable((observer: Observer<UserProfileInterface>): void => {
      this.http
        .get(url)
        .pipe(
          take(1),
          map((response: unknown): UserProfileInterface => response as UserProfileInterface),
        )
        .subscribe({
          next: (profile: UserProfileInterface): void => observer.next(profile),
          error: (error: ServerErrorInterface): void => observer.error(error),
          complete: (): void => observer.complete(),
        });
    });
  }

  /**
   * Method to check is current Json Web Token (JWT) is expired or not.
   */
  public isAuthenticated(): Observable<boolean> {
    const isTokenExpired = this.jwtHelper.isTokenExpired(this.localStorage.retrieve('token'));

    return of(!isTokenExpired);
  }

  /**
   * Method to make logout for current user, within this method we want to
   * clear `token` from local storage and reset service internal state about
   * logged in user.
   */
  public logout(): void {
    this.localStorage.clear('token');
    this.userData$.next(null);
  }

  /**
   * Method to "refresh" logged in user data to class internal state and return
   * that as an observable.
   */
  public getLoggedInUserData(): BehaviorSubject<UserDataInterface|null> {
    this.isAuthenticated()
      .subscribe((authenticated: boolean): void => {
        const payload = authenticated ? this.getUserData(this.localStorage.retrieve('token')) : null;

        this.userData$.next(payload);
      });

    return this.userData$;
  }

  /**
   * Helper method to determine user data from Json Web Token (JWT) data.
   */
  private getUserData(token: string): UserDataInterface {
    const decoded = this.jwtHelper.decodeToken(token);

    return {
      roles: decoded.roles,
      localization: {
        language: decoded.language,
        locale: decoded.locale,
        timezone: decoded.timezone,
      },
    };
  }
}
