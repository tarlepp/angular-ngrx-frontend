import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { noop, Observable, of } from 'rxjs';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';

import { ConfigurationService } from 'src/app/shared/services';
import { versionActions, versionSelectors } from 'src/app/store';

@Injectable()
export class BackendVersionInterceptor implements HttpInterceptor {
  private readonly store: Store = inject(Store);

  /**
   * Backend version interceptor which purpose is to update backend version
   * information to application footer and trigger frontend version information
   * fetch instantly - just to make sure that our frontend is using the latest
   * version.
   */
  public intercept(httpRequest: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
    return delegate
      .handle(httpRequest)
      .pipe(tap({
        next: (event: HttpEvent<any>): void => this.handle(of(event)),
        error: noop,
      }));
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
   * And if all of those steps are ok, then we dispatch following action;
   *  - newBackendVersion
   *
   * This will update version information to footer component and also trigger
   * frontend version check  instantly - just to make sure that we're using the
   * latest version of frontend application.
   *
   * If frontend version changes that will trigger opening a dialog that tells
   * user to reload application OR continue using it with old version.
   */
  private handle(httpEvent: Observable<HttpEvent<any>>): void {
    const apiUrl = ConfigurationService.configuration.apiUrl;

    httpEvent.pipe(
      filter((event: any): boolean => event instanceof HttpResponse),
      filter((event: HttpResponse<any>): boolean => new URL(event.url ?? '').host === new URL(apiUrl).host),
      filter((event: HttpResponse<any>): boolean => !event.url?.includes('/version')),
      filter((event: HttpResponse<any>): boolean => event.headers.has('X-API-VERSION')),
      withLatestFrom(this.store.select(versionSelectors.selectBackendVersion)),
      filter(([event, version]: [HttpResponse<any>, string]): boolean =>
        version !== '0.0.0' && event.headers.get('X-API-VERSION') !== version,
      ),
      map(([event]: [HttpResponse<any>, string]): string => event.headers.get('X-API-VERSION') ?? ''),
    )
    .subscribe((backendVersion: string): void => this.store.dispatch(versionActions.newBackendVersion({ backendVersion })));
  }
}
