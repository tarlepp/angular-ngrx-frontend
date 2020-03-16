import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Device, Viewport } from 'src/app/shared/enums';
import { LayoutState } from 'src/app/store/store-states';
import { layoutSelectors } from 'src/app/store/store-selectors';

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
