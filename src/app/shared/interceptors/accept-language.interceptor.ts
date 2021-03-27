import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';

import { Language } from 'src/app/shared/enums';
import { ConfigurationService } from 'src/app/shared/services';

@Injectable()
export class AcceptLanguageInterceptor implements HttpInterceptor {
  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(private localStorage: LocalStorageService) { }

  /**
   * Identifies and handles a given HTTP request.
   *
   * Within this we add `Accept-Language` header with user selected language to
   * all requests that are made against our backend - so that backend knows
   * which language to use within that request.
   */
  public intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (httpRequest.url.includes(new URL(ConfigurationService.configuration.apiUrl).host)) {
      const modified = httpRequest.clone({
        setHeaders: {
          'Accept-Language': this.localStorage.retrieve('language') || Language.DEFAULT,
        },
      });

      return next.handle(modified);
    }

    return next.handle(httpRequest);
  }
}
