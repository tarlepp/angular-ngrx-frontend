import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { noop, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { errorActions, ErrorState } from '../../store/error';
import { ConfigurationService } from '../services';
import { ServerErrorInterface } from '../interfaces';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  public constructor(private errorStore: Store<ErrorState>) { }

  public intercept(httpRequest: HttpRequest<any>, delegate: HttpHandler): Observable<HttpEvent<any>> {
    const modified = httpRequest.clone();

    return delegate
      .handle(modified)
      .pipe(tap(noop, (error: HttpErrorResponse): void => this.handle(modified, error)));
  }

  private handle(httpRequest: HttpRequest<any>, httpErrorResponse: HttpErrorResponse): void {
    this.dispatchMessage(httpErrorResponse);

    if (httpErrorResponse.status === 401
      && httpRequest.url !== ConfigurationService.configuration.tokenUrl
      && new URL(httpRequest.url).host === new URL(ConfigurationService.configuration.apiUrl).host
    ) {
      // TODO: Dispatch logout action to auth store
    }
  }

  private dispatchMessage(httpErrorResponse: HttpErrorResponse): void {
    let payload = {
      message: httpErrorResponse.toString(),
    } as ServerErrorInterface;

    if (httpErrorResponse.hasOwnProperty('error') && httpErrorResponse.error.hasOwnProperty('message')) {
      payload = httpErrorResponse.error as ServerErrorInterface;
    }

    this.errorStore.dispatch(errorActions.snackbar({error: payload}));
  }
}
