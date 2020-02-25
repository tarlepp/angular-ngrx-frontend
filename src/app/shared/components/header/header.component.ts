import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { UserProfileInterface } from '../../../auth/interfaces';
import { Language } from '../../enums';
import { AuthenticationState, LayoutState } from '../../../store/store-states';
import { authenticationSelectors, layoutSelectors } from '../../../store/store-selectors';
import { authenticationActions, layoutActions } from '../../../store/store-actions';

// Note that if you add new language, you need to define it's text tag here
marker([
  'component.header.menu.language.en',
  'component.header.menu.language.fi',
]);

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('userMenu') private userMenu: MatMenuTrigger;

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
        .subscribe((profile: UserProfileInterface|null): UserProfileInterface|null => this.profile = profile),
      );

    this.subscriptions
      .add(this.layoutStore
        .select(layoutSelectors.language)
        .subscribe((language: Language): Language => this.currentLanguage = language),
      );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public logout(): void {
    this.userMenu.closeMenu();
    this.authenticationStore.dispatch(
      authenticationActions.logout({ message: marker('messages.authentication.logout') }),
    );
  }

  public changeLanguage(language: Language): void {
    this.layoutStore.dispatch(layoutActions.changeLanguage({ language }));
  }
}
