import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { CredentialsRequestInterface } from 'src/app/auth/interfaces';
import { authenticationActions } from 'src/app/store/store-actions';
import { authenticationSelectors } from 'src/app/store/store-selectors';
import { AuthenticationState } from 'src/app/store/store-states';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public loading: boolean;

  private subscriptions: Subscription;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(private formBuilder: FormBuilder, private authenticationStore: Store<AuthenticationState>) {
    this.subscriptions = new Subscription();
  }

  /**
   * A callback method that is invoked immediately after the default change
   * detector has checked the directive's data-bound properties for the first
   * time, and before any of the view or content children have been checked.
   * It is invoked only once when the directive is instantiated.
   */
  public ngOnInit(): void {
    // Loading state of `Authentication` store
    this.subscriptions
      .add(this.authenticationStore
        .select(authenticationSelectors.loading)
        .subscribe((loading: boolean): boolean => this.loading = loading),
      );

    // Initialize login form
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required]],
    });
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * before a directive, pipe, or service instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Method to dispatch `login` action from login form submit event.
   */
  public submit(): void {
    const credentials: CredentialsRequestInterface = {
      ...this.loginForm.value,
    };

    this.authenticationStore.dispatch(authenticationActions.login({ credentials }));
  }
}
