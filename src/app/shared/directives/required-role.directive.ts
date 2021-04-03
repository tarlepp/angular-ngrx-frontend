import { Directive, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Role } from 'src/app/auth/enums';
import { authenticationSelectors } from 'src/app/store';

/**
 * Note that this directive will only "hide" the element where you use this,
 * so if that element contains some sensitive content - do not use this!
 *
 * Users can easily toggle visibility of that element, use `*ngIf` instead,
 * then users needs to take long road to see what the element really contains.
 */
@Directive({
  selector: '[appRequiredRole]',
})

export class RequiredRoleDirective implements OnInit, OnDestroy {
  @Input('appRequiredRole') public role?: Role | string;

  @HostBinding('style.display') private display: string;

  private subscription: Subscription;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(private store: Store) {
    this.display = 'none';
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
      this.store.select(authenticationSelectors.hasRole(this.role)).subscribe(
        (hasRole: boolean): void => {
          this.display = hasRole ? '' : 'none';
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
