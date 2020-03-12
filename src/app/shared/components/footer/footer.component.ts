import { AfterViewInit, Component, ElementRef, HostBinding, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { interval, Observable, Subscription } from 'rxjs';

import { VersionState } from 'src/app/store/store-states';
import { versionSelectors } from 'src/app/store/store-selectors';
import { versionActions } from 'src/app/store/store-actions';

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

  constructor(private versionStore: Store<VersionState>) {
    this.subscriptions = new Subscription();
  }

  public ngOnInit(): void {
    this.versionFrontend$ = this.versionStore.select(versionSelectors.versionFrontend);
    this.versionBackend$ = this.versionStore.select(versionSelectors.versionBackend);

    this.subscriptions
      .add(interval(1000 * 60)
        .subscribe((): void => this.versionStore.dispatch(versionActions.fetchFrontendVersion())),
      );

    this.versionStore.dispatch(versionActions.fetchBackendVersion());
  }

  public ngAfterViewInit(): void {
    setTimeout((): void => {
      const element = this.footerContainer.nativeElement;

      this.topOffset = `${ element.offsetHeight }px`;
      this.topMargin = `-${ element.offsetHeight }px`;
    }, 0);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
