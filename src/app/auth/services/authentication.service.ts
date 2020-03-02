import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable, Observer, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { ConfigurationService } from '../../shared/services';
import { ServerErrorInterface } from '../../shared/interfaces';
import {
  CredentialsRequestInterface,
  CredentialsResponseInterface,
  UserDataInterface,
  UserProfileInterface,
} from '../interfaces';

@Injectable()
export class AuthenticationService {
  private readonly httpOptions: object;
  private readonly userData$: BehaviorSubject<UserDataInterface|null>;

  public constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private jwtHelper: JwtHelperService,
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    this.userData$ = new BehaviorSubject<UserDataInterface|null>(null);
  }

  public authenticate(credentials: CredentialsRequestInterface): Observable<UserDataInterface|ServerErrorInterface> {
    return new Observable((observer: Observer<UserDataInterface|ServerErrorInterface>): void => {
      this.http
        .post(ConfigurationService.configuration.tokenUrl, credentials, this.httpOptions)
        .pipe(take(1))
        .subscribe(
          (token: CredentialsResponseInterface): void => {
            this.localStorage.store('token', token.token);

            observer.next(this.getUserData(token.token));
          },
          (error: ServerErrorInterface): void => {
            this.localStorage.clear('token');

            observer.error(error);
          },
          (): void => observer.complete(),
        );
    });
  }

  public getProfile(): Observable<UserProfileInterface|ServerErrorInterface> {
    const url = ConfigurationService.configuration.apiUrl + '/profile';

    return new Observable((observer: Observer<UserProfileInterface|ServerErrorInterface>): void => {
      this.http
        .get(url, this.httpOptions)
        .pipe(take(1))
        .subscribe(
          (profile: UserProfileInterface): void => observer.next(profile),
          (error: ServerErrorInterface): void => observer.error(error),
          (): void => observer.complete(),
        );
    });
  }

  public isAuthenticated(): Observable<boolean> {
    const isTokenExpired = this.jwtHelper.isTokenExpired(this.localStorage.retrieve('token'));

    return of(!isTokenExpired);
  }

  public logout(): void {
    this.localStorage.clear('token');
    this.userData$.next(null);
  }

  public getLoggedInUserData(): BehaviorSubject<UserDataInterface|null> {
    this.isAuthenticated()
      .subscribe((authenticated: boolean): void => {
        const token = this.localStorage.retrieve('token');
        const payload = authenticated ? this.getUserData(token) : null;

        this.userData$.next(payload);
      });

    return this.userData$;
  }

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
