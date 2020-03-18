import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { noop, Observable, of } from 'rxjs';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';

import { ConfigurationService } from 'src/app/shared/services';
import { VersionState } from 'src/app/store/store-states';
import { versionActions } from 'src/app/store/version/version.actions';
import { versionSelectors } from 'src/app/store/version/version.selectors';

@Injectable()
export class BackendVersionInterceptor implements HttpInterceptor {
  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(private versionStore: Store<VersionState>) { }

  /**
   * Backend version interceptor which purpose is to update backend version
   * information to application footer and trigger frontend version information
   * fetch instantly - just to make sure that our frontend is using the latest
   * version.
   */
  public intercept(httpRequest: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
    return delegate
      .handle(httpRequest)
      .pipe(tap((event: HttpEvent<any>): void => this.handle(of(event)), noop));
  }

  /**
   * Steps in here;
   *  1) We need `HttpResponse` event
   *  2) Request was made against our backend
   *  3) Request URL doesn't contain `/version`
   *  4) Response headers contains `X-API-VERSION`
   *  5) Fetch latest backend version from store
   *  6) Current version from store isn't `initial` value and it differs from
   *     response header value
   *
   * And if all of those steps are ok, then we dispatch following actions;
   *  - fetchBackendVersionSuccess
   *  - fetchFrontendVersion
   *
   * First one will update version information to footer component and second
   * one will trigger frontend version fetch instantly - just to make sure that
   * we're using the latest version of frontend application.
   *
   * If frontend version changes that will trigger opening a dialog that tells
   * user to reload application OR continue using it with old version.
   */
  private handle(httpEvent: Observable<HttpEvent<any>>): void {
    const apiUrl = ConfigurationService.configuration.apiUrl;

    httpEvent.pipe(
      filter((event: HttpEvent<any>): boolean => event instanceof HttpResponse),
      filter((event: HttpResponse<any>): boolean => new URL(event.url).host === new URL(apiUrl).host),
      filter((event: HttpResponse<any>): boolean => !event.url.includes('/version')),
      filter((event: HttpResponse<any>): boolean => event.headers.has('X-API-VERSION')),
      withLatestFrom(this.versionStore.select(versionSelectors.versionBackend)),
      filter(([event, version]): boolean => version !== '0.0.0' && event.headers.get('X-API-VERSION') !== version),
      map(([event]): string => event.headers.get('X-API-VERSION')),
    )
    .subscribe((version): void => {
      this.versionStore.dispatch(versionActions.fetchBackendVersionSuccess({ version }));
      this.versionStore.dispatch(versionActions.fetchFrontendVersion());
    });
  }
}
