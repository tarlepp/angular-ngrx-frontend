import { HttpResponse } from '@angular/common/http';

export type HttpCacheType = Record<string, {
  response: HttpResponse<any>,
  timestamp: number,
}>;
