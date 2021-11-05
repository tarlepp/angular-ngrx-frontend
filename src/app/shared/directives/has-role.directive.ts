import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Role } from 'src/app/auth/enums';
import { authenticationSelectors } from 'src/app/store';

@Directive({
  selector: '[appHasRole]',
})

export class HasRoleDirective implements OnInit, OnDestroy {
  @Input('appHasRole') public role: Role|string;

  private readonly subscription: Subscription;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private readonly templateRef: TemplateRef<any>,
    private readonly container: ViewContainerRef,
    private readonly store: Store,
  ) {
    this.role = '';
    this.subscription = new Subscription();
  }

  /**
   * A callback method that is invoked immediately after the default change
   * detector has checked the directive's data-bound properties for the first
   * time, and before any of the view or content children have been checked.
   * It is invoked only once when the directive is instantiated.
   */
  public ngOnInit(): void {
    this.subscription.add(
      this.store.select(authenticationSelectors.selectHasRole(this.role)).subscribe(
        (hasRole: boolean): void => {
          if (hasRole) {
            this.container.createEmbeddedView(this.templateRef);

            return;
          }

          this.container.clear();
        },
      ),
    );
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * before a directive, pipe, or service instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
