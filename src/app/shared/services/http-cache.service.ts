import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { HttpCacheType } from 'src/app/shared/types';

@Injectable({
  providedIn: 'root',
})
export class HttpCacheService {
  private requests: HttpCacheType;

  public constructor() {
    this.requests = {};
  }

  public get(url: string): HttpResponse<any>|undefined {
    if (this.requests[url] && this.requests[url].timestamp + 600 * 1000 < Date.now()) {
      this.invalidateUrl(url);
    }

    return this.requests[url]?.response;
  }

  public store(url: string, response: HttpResponse<any>): void {
    this.requests[url] = {
      response,
      timestamp: Date.now(),
    };
  }

  public invalidate(): void {
    this.requests = {};
  }

  public invalidateUrl(url: string): void {
    delete this.requests[url];
  }
}
