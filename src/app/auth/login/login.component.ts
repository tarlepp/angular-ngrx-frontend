import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  FlexFillDirective,
  FlexOffsetDirective,
  LayoutAlignDirective,
  LayoutDirective,
} from '@ngbracket/ngx-layout/flex';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { CredentialsRequestInterface } from 'src/app/auth/interfaces';
import { AutoFocusDirective } from 'src/app/shared/directives';
import { authenticationActions, authenticationSelectors } from 'src/app/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    FlexFillDirective,
    FlexOffsetDirective,
    LayoutDirective,
    LayoutAlignDirective,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    AutoFocusDirective,
    MatError,
    MatButton,
    TranslocoPipe,
  ],
})

export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('loginFormElement') public loginFormElement!: NgForm;

  public readonly loginForm: UntypedFormGroup;
  public loading: boolean = false;
  public focus: boolean = true;

  private isError: boolean = false;
  private readonly formBuilder: UntypedFormBuilder = inject(UntypedFormBuilder);
  private readonly store: Store = inject(Store);
  private readonly subscriptions: Subscription = new Subscription();

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor() {
    // Initialize login form
    this.loginForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.minLength(3)]],
      password: [null, [Validators.required]],
    });
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
      .add(this.store
        .select(authenticationSelectors.selectIsLoading)
        .subscribe((loading: boolean): boolean => this.loading = loading),
      );

    // Reset login form if error happens
    this.subscriptions
      .add(this.store
        .pipe(authenticationSelectors.selectFilteredError)
        .subscribe((): void => {
          this.loginForm.reset();
          this.loginFormElement.resetForm();
          this.focus = true;
          this.isError = true;
        }),
      );
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * before a directive, pipe, or service instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (this.isError) {
      this.store.dispatch(authenticationActions.resetError());
    }
  }

  /**
   * Method to dispatch `login` action from login form submit event.
   */
  public submit(): void {
    const credentials: CredentialsRequestInterface = {
      ...this.loginForm.value,
    };

    this.focus = false;

    this.store.dispatch(authenticationActions.login({ credentials }));
  }
}
