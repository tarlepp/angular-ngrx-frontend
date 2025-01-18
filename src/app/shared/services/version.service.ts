import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { take } from 'rxjs/operators';

import { ServerErrorInterface, VersionInterface } from 'src/app/shared/interfaces';
import { ConfigurationService } from 'src/app/shared/services/configuration-service';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private readonly httpClient: HttpClient,
  ) {
  }

  /**
   * Method to fetch frontend side version information from static JSON file
   * that is generated when application is built. So if this file contains
   * different version than our current `environment.version` we are sure that
   * frontend application has been updated and user hasn't done hard reload
   * after that.
   */
  public fetchFrontendVersion(): Observable<string> {
    const ts = Math.round((new Date()).getTime() / 1000);

    return new Observable((observer: Observer<string>): void => {
      this.httpClient
        .get(`/assets/version.json?t=${ ts }`)
        .pipe(take(1))
        .subscribe({
          next: (data: VersionInterface|any): void => observer.next(data.version),
          error: (error: ServerErrorInterface): void => observer.error(error),
          complete: (): void => observer.complete(),
        });
    });
  }

  /**
   * Method to fetch backend side version information from specified API
   * endpoint. This method is just used once when application is initialized.
   *
   * After that point we will dispatch backend version changes from each API
   * endpoint request via specified HTTP interceptor.
   */
  public fetchBackendVersion(): Observable<string> {
    const ts = Math.round((new Date()).getTime() / 1000);

    return new Observable((observer: Observer<string>): void => {
      this.httpClient
        .get(`${ConfigurationService.configuration.apiUrl}/version?t=${ ts }`)
        .pipe(take(1))
        .subscribe({
          next: (data: VersionInterface|any): void => observer.next(data.version),
          error: (error: ServerErrorInterface): void => observer.error(error),
          complete: (): void => observer.complete(),
        });
    });
  }
}
