import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { authenticationActions, authenticationSelectors, AuthenticationState } from '../../../store/authentication';
import { layoutActions, layoutSelectors, LayoutState } from '../../../store/layout';
import { UserProfileInterface } from '../../../auth/interfaces';
import { Language } from '../../enums';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('userMenu', {static: true}) private userMenu: MatMenuTrigger;

  public profile?: UserProfileInterface;
  public loading$: Observable<boolean>;
  public languages: Array<Language>;
  public currentLanguage: Language;

  private subscriptions: Subscription;

  public constructor(private authenticationStore: Store<AuthenticationState>, private layoutStore: Store<LayoutState>) {
    this.currentLanguage = Language.DEFAULT;
    this.subscriptions = new Subscription();

    this.languages = Object
      .keys(Language)
      .filter((key: string): boolean => key !== 'DEFAULT')
      .map((key: string): Language => Language[key]);
  }

  public ngOnInit(): void {
    this.loading$ = this.authenticationStore.select(authenticationSelectors.loading);

    this.subscriptions
      .add(this.authenticationStore
        .select(authenticationSelectors.profile)
        .subscribe((profile: UserProfileInterface|null): void => {
          this.profile = profile;
        }),
      );

    this.subscriptions
      .add(this.layoutStore
        .select(layoutSelectors.language)
        .subscribe((language: Language): void => {
          this.currentLanguage = language;
        }),
      );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public logout(): void {
    this.userMenu.closeMenu();
    this.authenticationStore.dispatch(authenticationActions.logout({ message: 'messages.authentication.logout' }));
  }

  public changeLanguage(language: Language): void {
    this.layoutStore.dispatch(layoutActions.changeLanguage({ language }));
  }
}
