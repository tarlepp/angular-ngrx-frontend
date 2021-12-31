import { HttpResponse } from '@angular/common/http';

export interface HttpCacheInterface {
  [key: string]: {
    response: HttpResponse<any>;
    timestamp: number;
  };
}
