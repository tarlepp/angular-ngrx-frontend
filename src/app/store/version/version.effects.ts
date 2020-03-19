import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TypedAction } from '@ngrx/store/src/models';
import { Observable, from, of } from 'rxjs';
import { catchError, filter, map, pluck, switchMap } from 'rxjs/operators';

import { VersionChangeDialogComponent } from 'src/app/shared/components';
import { VersionService } from 'src/app/shared/services';
import { versionActions } from 'src/app/store/store-actions';
import { BackendVersionTypes, FrontendVersionTypes } from 'src/app/store/store-types';
import { VersionAction } from 'src/app/store/store.action';
import { environment } from 'src/environments/environment';

@Injectable()
export class VersionEffects {
  // noinspection JSUnusedLocalSymbols
  private fetchFrontendVersion$: Observable<TypedAction<FrontendVersionTypes>> = createEffect(
    (): Observable<TypedAction<FrontendVersionTypes>> => this.actions$
    .pipe(
      ofType(VersionAction.FETCH_FRONTEND_VERSION),
      switchMap((): Observable<TypedAction<FrontendVersionTypes>> =>
        from(this.versionService.fetchFrontendVersion()
          .pipe(
            map((version: string): TypedAction<VersionAction.FETCH_FRONTEND_VERSION_SUCCESS> =>
              versionActions.fetchFrontendVersionSuccess({ version }),
            ),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<TypedAction<VersionAction.FETCH_FRONTEND_VERSION_FAILURE>> =>
              of(versionActions.fetchFrontendVersionFailure({ error: httpErrorResponse.error })),
            ),
          ),
        ),
      ),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  private fetchBackendVersion$: Observable<TypedAction<BackendVersionTypes>> = createEffect(
    (): Observable<TypedAction<BackendVersionTypes>> => this.actions$
    .pipe(
      ofType(VersionAction.FETCH_BACKEND_VERSION),
      switchMap((): Observable<TypedAction<BackendVersionTypes>> =>
        from(this.versionService.fetchBackendVersion()
          .pipe(
            map((version: string): TypedAction<VersionAction.FETCH_BACKEND_VERSION_SUCCESS> =>
              versionActions.fetchBackendVersionSuccess({ version }),
            ),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<TypedAction<VersionAction.FETCH_BACKEND_VERSION_FAILURE>> =>
              of(versionActions.fetchBackendVersionFailure({ error: httpErrorResponse.error })),
            ),
          ),
        ),
      ),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  private versionChanged$: Observable<void> = createEffect((): Observable<void> => this.actions$
    .pipe(
      ofType(VersionAction.FETCH_FRONTEND_VERSION_SUCCESS),
      pluck('version'),
      filter((version: string): boolean => environment.version !== version),
      map((versionNew: string): void => {
        this.dialog
          .open(
            VersionChangeDialogComponent,
            {
              disableClose: true,
              maxWidth: '400px',
              data: {
                versionOld: environment.version,
                versionNew,
              },
            },
          )
          .beforeClosed()
          .subscribe((): void => location.reload());
      }),
    ),
    { dispatch: false },
  );

  public constructor(private actions$: Actions, private versionService: VersionService, private dialog: MatDialog) { }
}
