import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { authenticationActions, authenticationSelectors, AuthenticationState } from '../../../store/authentication';
import { UserProfileInterface } from '../../../auth/interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('userMenu', {static: true}) private userMenu: MatMenuTrigger;

  public profile?: UserProfileInterface;
  public loading$: Observable<boolean>;

  private subscriptions: Subscription;

  public constructor(private authenticationStore: Store<AuthenticationState>) {
    this.subscriptions = new Subscription();
  }

  public ngOnInit(): void {
    this.loading$ = this.authenticationStore.pipe(select(authenticationSelectors.loading));

    this.subscriptions
      .add(this.authenticationStore
        .pipe(select(authenticationSelectors.profile))
        .subscribe((profile: UserProfileInterface|null): void => {
          this.profile = profile;
        }),
      );
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public logout(): void {
    this.userMenu.closeMenu();
    this.authenticationStore.dispatch(authenticationActions.logout({message: 'You signed out'}));
  }
}
