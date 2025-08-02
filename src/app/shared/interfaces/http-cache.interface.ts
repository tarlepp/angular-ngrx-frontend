import { HttpResponse } from '@angular/common/http';

export type HttpCacheInterface = Record<string, {
  response: HttpResponse<any>;
  timestamp: number;
}>;
