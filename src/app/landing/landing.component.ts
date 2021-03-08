import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { Device, Viewport } from 'src/app/shared/enums';
import { AppState, layoutSelectors } from 'src/app/store';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})

export class LandingComponent implements OnInit, OnDestroy {
  public viewport$: Observable<Viewport>;
  public device$: Observable<Device>;

  private subscription: Subscription;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(private store: Store<AppState>) {
    this.subscription = new Subscription();
  }

  /**
   * A callback method that is invoked immediately after the default change
   * detector has checked the directive's data-bound properties for the first
   * time, and before any of the view or content children have been checked.
   * It is invoked only once when the directive is instantiated.
   */
  public ngOnInit(): void {
    // Initialize `viewport$` and `device$` observables - remove these if you don't need these
    this.viewport$ = this.store.select(layoutSelectors.viewport);
    this.device$ = this.store.select(layoutSelectors.device);
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * before a directive, pipe, or service instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
