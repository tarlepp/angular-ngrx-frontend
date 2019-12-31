import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageService } from 'ngx-webstorage';
import { BehaviorSubject, Observable, Observer, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { ConfigurationService } from '../../shared/services';
import { ServerErrorInterface } from '../../shared/interfaces';
import { CredentialsRequestInterface, CredentialsResponseInterface, UserProfileInterface } from '../interfaces';
import { Role } from '../enums';

@Injectable()
export class AuthenticationService {
  private readonly httpOptions: object;
  private readonly userRoles$: BehaviorSubject<Array<Role>|null>;

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

    this.userRoles$ = new BehaviorSubject<Array<Role>|null>(null);
  }

  public authenticate(credentials: CredentialsRequestInterface): Observable<string[]|ServerErrorInterface> {
    return new Observable((observer: Observer<string[]|ServerErrorInterface>): void => {
      this.http
        .post(ConfigurationService.configuration.tokenUrl, credentials, this.httpOptions)
        .pipe(take(1))
        .subscribe(
          (token: CredentialsResponseInterface): void => {
            this.localStorage.store('token', token.token);
            const decoded = this.jwtHelper.decodeToken(token.token);

            observer.next(decoded.roles);
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
    this.userRoles$.next(null);
  }

  public getLoggedInRoles(): BehaviorSubject<Array<Role>|null> {
    this.isAuthenticated()
      .subscribe((authenticated: boolean): void => {
        const token = this.localStorage.retrieve('token');
        const decoded = this.jwtHelper.decodeToken(token);

        this.userRoles$.next(authenticated ? decoded.roles : null);
      });

    return this.userRoles$;
  }
}
