import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { marker } from '@jsverse/transloco-keys-manager/marker';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { UserProfileInterface } from 'src/app/auth/interfaces';
import { languages } from 'src/app/shared/constants';
import { Language, Theme } from 'src/app/shared/enums';
import { authenticationActions, authenticationSelectors, layoutActions, layoutSelectors } from 'src/app/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('userMenu') private readonly userMenu!: MatMenuTrigger;

  public profile: UserProfileInterface|null;
  public languages: Array<Language>;
  public currentLanguage: Language;
  public readonly loading$: Observable<boolean>;

  private readonly subscriptions: Subscription;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private readonly store: Store,
  ) {
    this.profile = null;
    this.languages = languages;
    this.currentLanguage = Language.DEFAULT;

    this.loading$ = this.store.select(authenticationSelectors.selectIsLoading);

    this.subscriptions = new Subscription();


    // Note that if you add new language, you need to define it's text tag here
    marker([
      'component.header.menu.language.en',
      'component.header.menu.language.fi',
    ]);
  }

  /**
   * A callback method that is invoked immediately after the default change
   * detector has checked the directive's data-bound properties for the first
   * time, and before any of the view or content children have been checked.
   * It is invoked only once when the directive is instantiated.
   */
  public ngOnInit(): void {
    // Subscribe to user profile changes
    this.subscriptions
      .add(this.store
        .select(authenticationSelectors.selectProfile)
        .subscribe((profile: UserProfileInterface|null): UserProfileInterface|null => this.profile = profile),
      );

    // Subscribe to language changes
    this.subscriptions
      .add(this.store
        .select(layoutSelectors.selectLanguage)
        .subscribe((language: Language): Language => this.currentLanguage = language),
      );
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * before a directive, pipe, or service instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Method to dispatch logout action to authentication store, within this
   * action store reducer + effect will make all necessary things to logout
   * currently logged in user.
   */
  public logout(): void {
    this.userMenu.closeMenu();
    this.store.dispatch(authenticationActions.logout({ message: marker('messages.authentication.logout') }));
  }

  /**
   * Method to dispatch change language action to layout store.
   */
  public changeLanguage(language: Language): void {
    this.store.dispatch(layoutActions.changeLanguage({ language }));
  }

  /**
   * Method to dispatch change theme action to layout feature store.
   */
  public changeTheme(): void {
    this.store.select(layoutSelectors.selectTheme)
      .pipe(take(1))
      .subscribe(
        (theme: Theme): void => this.store.dispatch(layoutActions.changeTheme({ theme: theme === Theme.DARK ? Theme.LIGHT : Theme.DARK })),
      );
  }
}
