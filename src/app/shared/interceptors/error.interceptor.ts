import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { noop, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { ConfigurationService } from 'src/app/shared/services';
import { authenticationActions, errorActions } from 'src/app/store';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly router: Router = inject(Router);
  private readonly store: Store = inject(Store);

  /**
   * Interceptor to handle possible HTTP errors from backend. Within this
   * interceptor we have basically three (3) different use cases;
   *  1) Configured backend server responded with status 0 (Internal server error)
   *      => Redirect user to `oops` component
   *  2) Configured backend server responded with status 401 (Unauthorized)
   *      => Logout user
   *  3) "normal" error
   *      => Show error in snackbar
   *
   * Catch possible unhandled errors - just to make sure that observable pipe
   * within this isn't broke.
   */
  public intercept(httpRequest: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
    const modified = httpRequest.clone();

    return delegate
      .handle(modified)
      .pipe(
        tap({
          next: noop,
          error: (error: HttpErrorResponse): void => this.handle(modified, error),
        }),
        catchError((error: HttpErrorResponse): Observable<never> => {
          let payload = error;

          if (error && Object.prototype.hasOwnProperty.call(error, 'error') && error.status === 0) {
            payload = {
              ...error,
              error: {
                code: 0,
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                message: error.message || `Unknown error - ${error.toString()}`,
                status: error.status || 0,
                statusText: error.statusText || '',
              },
            };
          }

          return throwError(() => payload);
        }),
      );
  }

  /**
   * Method to handle error http response, within this method we have three (3)
   * different result;
   *  1) Internal server error (host need to be same as configured backend)
   *  2) Unauthorized error (host need to be same as configured backend)
   *  3) All the other http errors to _any_ url
   *
   * With first two of those we're just redirecting user to another page or
   * dispatch logout action to authentication store. And with that third use
   * case we're just dispatching action to error store to trigger snackbar
   * opening and showing that error.
   */
  private handle(httpRequest: HttpRequest<any>, httpErrorResponse: HttpErrorResponse): void {
    const sameHost = new URL(httpRequest.url).host === new URL(ConfigurationService.configuration.apiUrl).host;
    const notTokenUrl = httpRequest.url !== ConfigurationService.configuration.tokenUrl;

    // Internal server error
    if (httpErrorResponse.status === 0 && sameHost) {
      this.router.navigate(['/oops']).finally();

      return;
    } else if (httpErrorResponse.status === 401 && sameHost && notTokenUrl) { // Unauthorized request
      this.store.dispatch(authenticationActions.logout({ message: 'Unauthorized' }));

      return;
    }

    // Otherwise just show that error in snackbar
    this.dispatchMessage(httpErrorResponse);
  }

  /**
   * Method to dispatch snackbar action to application global error store, so
   * that user can see the actual error message(s) in that snackbar.
   */
  private dispatchMessage(httpErrorResponse: HttpErrorResponse): void {
    let error: ServerErrorInterface = {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      message: httpErrorResponse.toString(),
      code: 0,
      status: httpErrorResponse.status || 0,
      statusText: httpErrorResponse.statusText || '',
    };

    if (Object.prototype.hasOwnProperty.call(httpErrorResponse, 'error') && Object.prototype.hasOwnProperty.call(httpErrorResponse.error, 'message')) {
      error = httpErrorResponse.error as ServerErrorInterface;
    } else if (Object.prototype.hasOwnProperty.call(httpErrorResponse, 'message')) {
      error.message = httpErrorResponse.message;
    }

    this.store.dispatch(errorActions.showSnackbar({ error }));
  }
}
