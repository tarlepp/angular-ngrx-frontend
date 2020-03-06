import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { noop, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ConfigurationService } from 'src/app/shared/services';
import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { AuthenticationState, ErrorState } from 'src/app/store/store-states';
import { authenticationActions, errorActions } from 'src/app/store/store-actions';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  public constructor(
    private router: Router,
    private errorStore: Store<ErrorState>,
    private authenticationStore: Store<AuthenticationState>,
  ) { }

  public intercept(httpRequest: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
    const modified = httpRequest.clone();

    return delegate
      .handle(modified)
      .pipe(tap(noop, (error: HttpErrorResponse): void => this.handle(modified, error)));
  }

  private handle(httpRequest: HttpRequest<any>, httpErrorResponse: HttpErrorResponse): void {
    const sameHost = new URL(httpRequest.url).host === new URL(ConfigurationService.configuration.apiUrl).host;

    if (httpErrorResponse.status === 401 && sameHost && httpRequest.url !== ConfigurationService.configuration.tokenUrl) {
      this.authenticationStore.dispatch(authenticationActions.logout({ message: 'Unauthorized' }));

      return;
    } else if (httpErrorResponse.status === 0 && sameHost) {
      this.router.navigate(['/oops']).finally();

      return;
    }

    this.dispatchMessage(httpErrorResponse);
  }

  private dispatchMessage(httpErrorResponse: HttpErrorResponse): void {
    let payload = {
      message: httpErrorResponse.toString(),
    } as ServerErrorInterface;

    if (httpErrorResponse.hasOwnProperty('error') && httpErrorResponse.error.hasOwnProperty('message')) {
      payload = httpErrorResponse.error as ServerErrorInterface;
    } else if (httpErrorResponse.hasOwnProperty('message')) {
      payload.message = httpErrorResponse.message;
    }

    this.errorStore.dispatch(errorActions.snackbar({ error: payload }));
  }
}
