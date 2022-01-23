import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AcceptLanguageInterceptor } from 'src/app/shared/interceptors/accept-language.interceptor';
import { BackendVersionInterceptor } from 'src/app/shared/interceptors/backend-version.interceptor';
import { ErrorInterceptor } from 'src/app/shared/interceptors/error.interceptor';
import { HttpCacheInterceptor } from 'src/app/shared/interceptors/http-cache.interceptor';

export const httpInterceptors = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpCacheInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AcceptLanguageInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: BackendVersionInterceptor, multi: true },
];
