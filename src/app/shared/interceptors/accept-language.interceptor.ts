import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';

import { ConfigurationService } from '../services';
import { Language } from '../enums';

@Injectable()
export class AcceptLanguageInterceptor implements HttpInterceptor {
  public constructor(private localStorage: LocalStorageService) { }

  public intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let output;

    try {
      if (new URL(httpRequest.url).host === new URL(ConfigurationService.configuration.apiUrl).host) {
        const modified = httpRequest.clone({
          setHeaders: {
            'Accept-Language': this.localStorage.retrieve('language') || Language.DEFAULT,
          },
        });

        output = next.handle(modified);
      }
    } catch (e) {
      output = next.handle(httpRequest);
    }

    return output;
  }
}
