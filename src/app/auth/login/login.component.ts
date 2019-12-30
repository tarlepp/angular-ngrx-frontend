import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { authenticationActions, authenticationSelectors, AuthenticationState } from '../../store/authentication';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public loading: boolean;

  private subscriptions: Subscription;

  public constructor(private formBuilder: FormBuilder, private authenticationStore: Store<AuthenticationState>) {
    this.subscriptions = new Subscription();
  }

  public ngOnInit(): void {
    this.subscriptions
      .add(this.authenticationStore
        .pipe(select(authenticationSelectors.loading))
        .subscribe((loading: boolean): void => {
          this.loading = loading;
        }),
      );

    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required]],
    });
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public submit(): void {
    this.authenticationStore.dispatch(authenticationActions.login({credentials: this.loginForm.value}));
  }
}
