import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Role } from 'src/app/auth/enums';
import { authenticationSelectors } from 'src/app/store';

@Directive({
  selector: '[appHasNotAllRoles]',
})

export class HasNotAllRolesDirective implements OnInit, OnDestroy {
  @Input('appHasNotAllRoles') public role: Array<Role|string> = [];

  private readonly templateRef: TemplateRef<any> = inject<TemplateRef<any>>(TemplateRef);
  private readonly container: ViewContainerRef = inject(ViewContainerRef);
  private readonly store: Store = inject(Store);
  private readonly subscription: Subscription = new Subscription();

  /**
   * A callback method that is invoked immediately after the default change
   * detector has checked the directive's data-bound properties for the first
   * time, and before any of the view or content children have been checked.
   * It is invoked only once when the directive is instantiated.
   */
  public ngOnInit(): void {
    this.subscription.add(
      this.store.select(authenticationSelectors.selectHasRoles(this.role)).subscribe(
        (hasRoles: boolean): void => {
          if (!hasRoles) {
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
