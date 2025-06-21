import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Device, Viewport } from 'src/app/shared/enums';
import { layoutSelectors } from 'src/app/store';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: [
    './landing.component.scss',
  ],
  imports: [
    AsyncPipe,
  ],
})

export class LandingComponent {
  public readonly viewport$: Observable<Viewport>;
  public readonly device$: Observable<Device>;

  private readonly store: Store = inject(Store);

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor() {
    // Initialize `viewport$` and `device$` observables - remove these if you don't need these
    this.viewport$ = this.store.select(layoutSelectors.selectViewport);
    this.device$ = this.store.select(layoutSelectors.selectDevice);
  }
}
