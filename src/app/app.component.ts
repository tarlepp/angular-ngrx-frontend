import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { LocalStorageService } from 'ngx-webstorage';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { Role } from './auth/enums';
import { AuthenticationService } from './auth/services';
import { authenticationActions, authenticationSelectors, AuthenticationState } from './store/authentication';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit, OnDestroy {
  private loggedIn: boolean;
  private tokenInterval: number;
  private subscription: Subscription;

  public constructor(
    private localStorage: LocalStorageService,
    private authenticationStore: Store<AuthenticationState>,
    private authenticationService: AuthenticationService,
  ) {
    this.loggedIn = false;
    this.subscription = new Subscription();
  }

  public ngOnInit(): void {
    this.setTokenInterval();

    this.subscription
      .add(this.localStorage
        .observe('token')
        .subscribe((value): void => {
          if (value !== undefined) {
            clearInterval(this.tokenInterval);

            this.setTokenInterval();
          }
        }),
      );

    this.subscription
      .add(this.authenticationService
        .getLoggedInRoles()
        .subscribe((roles: Array<Role>|null): void => {
          if (roles === null && this.loggedIn) {
            this.logout(null);
          } else if (roles !== null && !this.loggedIn) {
            this.authenticationStore.dispatch(authenticationActions.loginSuccess({roles}));
          }
        }),
      );

    this.subscription
      .add(this.authenticationStore
        .pipe(select(authenticationSelectors.loggedIn))
        .subscribe((loggedIn: boolean): void => {
          this.loggedIn = loggedIn;
        }),
      );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private setTokenInterval(): void {
    this.tokenInterval = setInterval((): void => this.checkToken(), 15000);
  }

  private checkToken(): void {
    this.authenticationService
      .isAuthenticated()
      .pipe(take(1))
      .subscribe((authenticated: boolean): void => {
        if (this.loggedIn && !authenticated) {
          this.logout('Session timeout');
        }
      });
  }

  private logout(message?: string): void {
    this.authenticationStore.dispatch(authenticationActions.logout({message}));
  }
}
