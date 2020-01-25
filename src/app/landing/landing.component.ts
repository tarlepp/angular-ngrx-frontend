import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { layoutSelectors, LayoutState } from '../store/layout';
import { Device, Viewport } from '../shared/enums';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})

export class LandingComponent implements OnInit, OnDestroy {
  public viewport: Viewport;
  public device: Device;

  private subscription: Subscription;

  constructor(private layoutStore: Store<LayoutState>) {
    this.subscription = new Subscription();
  }

  public ngOnInit(): void {
    this.subscription
      .add(this.layoutStore
        .select(layoutSelectors.viewport)
        .subscribe((viewport: Viewport): Viewport => this.viewport = viewport),
      );

    this.subscription
      .add(this.layoutStore
        .select(layoutSelectors.device)
        .subscribe((device: Device): Device => this.device = device),
      );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
