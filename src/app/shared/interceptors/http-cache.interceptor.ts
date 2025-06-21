import {
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { HttpCacheService } from 'src/app/shared/services/http-cache.service';

/**
 * If you want to enable cache for specified GET request, you need to add
 * following context to your request:
 *
 *  this.http.get(url, { context: new HttpContext().set(cacheable, true) });
 */
export const cacheable = new HttpContextToken(() => false);

@Injectable()
export class HttpCacheInterceptor implements HttpInterceptor {
  private readonly httpCacheService: HttpCacheService = inject(HttpCacheService);

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only cache requests that are configured to be cached
    if (!req.context.get(cacheable)) {
      return next.handle(req);
    }

    // Invalidate cache if the request method is not GET and process to next interceptor
    if (req.method !== 'GET') {
      this.httpCacheService.invalidate();

      return next.handle(req);
    }

    const cachedResponse = this.httpCacheService.get(req.url);

    // Cached response found, so return it directly and skip rest of the interceptors
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // Otherwise, continue to the next interceptor and store response to cache
    return next.handle(req)
      .pipe(
        tap((event: HttpEvent<any>): void => {
          if (event instanceof HttpResponse) {
            this.httpCacheService.store(req.url, event);
          }
        }),
      );
  }
}
