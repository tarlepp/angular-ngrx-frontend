import { AfterViewInit, Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription, interval } from 'rxjs';

import { versionActions } from 'src/app/store/store-actions';
import { versionSelectors } from 'src/app/store/store-selectors';
import { VersionState } from 'src/app/store/store-states';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})

export class FooterComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding('style.top') public topOffset = '0';
  @HostBinding('style.position') public position = 'relative';
  @HostBinding('style.margin-top') public topMargin = '0';
  @ViewChild('footerContainer') public footerContainer: ElementRef;

  public versionFrontend$: Observable<string>;
  public versionBackend$: Observable<string>;

  private subscriptions: Subscription;

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  constructor(private versionStore: Store<VersionState>) {
    this.subscriptions = new Subscription();
  }

  /**
   * A callback method that is invoked immediately after the default change
   * detector has checked the directive's data-bound properties for the first
   * time, and before any of the view or content children have been checked.
   * It is invoked only once when the directive is instantiated.
   */
  public ngOnInit(): void {
    // Initialize `versionFrontend$` and `versionBackend$` observables, that are used in component
    this.versionFrontend$ = this.versionStore.select(versionSelectors.versionFrontend);
    this.versionBackend$ = this.versionStore.select(versionSelectors.versionBackend);

    // Lets check if frontend version has been changed every 5 minutes
    this.subscriptions
      .add(interval(1000 * 60 * 5)
        .subscribe((): void => this.versionStore.dispatch(versionActions.fetchFrontendVersion())),
      );

    // Fetch initial version of backend
    this.versionStore.dispatch(versionActions.fetchBackendVersion());
  }

  /**
   * A callback method that is invoked immediately after Angular has completed
   * initialization of a component's view. It is invoked only once when the
   * view is instantiated.
   */
  public ngAfterViewInit(): void {
    // We need to move our footer below the current viewport to get nice look
    setTimeout((): void => {
      const element = this.footerContainer.nativeElement;

      this.topOffset = `${ element.offsetHeight }px`;
      this.topMargin = `-${ element.offsetHeight }px`;
    }, 0);
  }

  /**
   * A callback method that performs custom clean-up, invoked immediately
   * before a directive, pipe, or service instance is destroyed.
   */
  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
