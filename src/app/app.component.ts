import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import { LocalStorageService } from 'ngx-webstorage';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map, take } from 'rxjs/operators';

import { UserDataInterface } from 'src/app/auth/interfaces';
import { AuthenticationService } from 'src/app/auth/services';
import { Theme, Viewport } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';
import { authenticationActions, authenticationSelectors, layoutActions, layoutSelectors } from 'src/app/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false,
})

export class AppComponent implements OnInit, OnDestroy {
  private loggedIn: boolean;
  private tokenInterval: number;
  private readonly subscription: Subscription;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private readonly localStorage: LocalStorageService,
    private readonly mediaObserver: MediaObserver,
    private readonly store: Store,
    private readonly authenticationService: AuthenticationService,
  ) {
    this.loggedIn = false;
    this.tokenInterval = 0;
    this.subscription = new Subscription();
  }

  /**
   * A callback method that is invoked immediately after the default change
   * detector has checked the directive's data-bound properties for the first
   * time, and before any of the view or content children have been checked.
   * It is invoked only once when the directive is instantiated.
   */
  public ngOnInit(): void {
    this.initLayout();
    this.initAuthentication();
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * before a directive, pipe, or service instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private initAuthentication(): void {
    this.checkToken();
    this.setTokenInterval();

    /**
     * We need to reset current token interval and start new one when user
     * logged in to application.
     */
    this.subscription.add(this.localStorage
      .observe('token')
      .pipe(filter((value: string|undefined): boolean => value !== undefined))
      .subscribe((): void => this.setTokenInterval()),
    );

    /**
     * We need to track user logged in state, within this we have two (2)
     * different scenarios;
     *  1) Authentication service says that user is not logged in, but this
     *     component says that user is logged in. Within this case we need
     *     _always_ logout user.
     *  2) Authentication service says that user is logged in, but this
     *     component says that user is not logged in. Within this case we
     *     need to dispatch `loginSuccess` action.
     */
    this.subscription.add(this.authenticationService
      .getLoggedInUserData()
      .subscribe((userData: UserDataInterface|null): void => {
        if (userData === null && this.loggedIn) {
          this.logout(null);
        } else if (userData !== null && !this.loggedIn) {
          this.authenticationService
          .isAuthenticated()
          .pipe(take(1))
          .subscribe((loggedIn: boolean): void => loggedIn
            ? this.store.dispatch(authenticationActions.loginSuccess({ userData }))
            : this.logout(marker('messages.authentication.timeout')),
          );
        }
      }),
    );

    // Is used logged in to application or not.
    this.subscription.add(this.store
      .select(authenticationSelectors.selectIsLoggedIn)
      .subscribe((loggedIn: boolean): boolean => this.loggedIn = loggedIn),
    );
  }

  /**
   * Method to initialize layout related data and add watcher for viewport
   * changes to update store.
   */
  private initLayout(): void {
    // Ensure that we're using correct theme on application init
    this.store.select(layoutSelectors.selectTheme).pipe(take(1)).subscribe(
      (theme: Theme): void => this.store.dispatch(layoutActions.changeTheme({ theme })),
    );

    // Ensure that we're using correct localization settings on application init
    this.store.select(layoutSelectors.selectLocalization).pipe(take(1)).subscribe(
      (localization: LocalizationInterface): void => this.store.dispatch(layoutActions.updateLocalization({ localization })),
    );

    /**
     * If/when user changes browser size we need to update layout store state
     * to contain proper information about following things;
     *  - viewport (xs, sm, md, lg, xl)
     *  - isMobile
     *  - isTablet
     *  - isDesktop
     */
    this.subscription
      .add(this.mediaObserver
        .asObservable()
        .pipe(
          filter((changes: Array<MediaChange>): boolean => changes.length > 0),
          map((changes: Array<MediaChange>): MediaChange => changes[0]),
          distinctUntilChanged((prev: MediaChange, curr: MediaChange): boolean => prev.mqAlias === curr.mqAlias),
        )
        .subscribe((mediaChange: MediaChange): void =>
          this.store.dispatch(layoutActions.changeViewport({ viewport: mediaChange.mqAlias as Viewport })),
        ),
      );

    // Ensure that we're using correct theme on application init
    this.store.select(layoutSelectors.selectTheme).pipe(take(1)).subscribe(
      (theme: Theme): void => this.store.dispatch(layoutActions.changeTheme({ theme })),
    );
  }

  /**
   * Method to check if current logged in user token is valid or not. This
   * method is called with interval so that we can actually check the token
   * expiration status properly.
   *
   * If token is not valid logout action is dispatched to `Authentication`
   * store.
   */
  private checkToken(): void {
    this.authenticationService.isAuthenticated().pipe(
      take(1),
      filter((authenticated: boolean): boolean => this.loggedIn && !authenticated),
    )
    .subscribe((): void => this.logout(marker('messages.authentication.timeout')));
  }

  /**
   * Method to set token interval that is used to check that user is really
   * authenticated and current Json Web Token (JWT) is not expired.
   */
  private setTokenInterval(): void {
    clearInterval(this.tokenInterval);

    this.tokenInterval = window.setInterval((): void => this.checkToken(), 15000);
  }

  /**
   * Helper method to dispatch `logout` event to `Authentication` store.
   */
  private logout(message: string|null): void {
    this.store.dispatch(authenticationActions.logout({ message }));
  }
}
