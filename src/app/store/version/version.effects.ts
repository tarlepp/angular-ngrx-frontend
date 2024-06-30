import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap } from 'rxjs/operators';

import { VersionChangeDialogComponent } from 'src/app/shared/components';
import { VersionService } from 'src/app/shared/services';
import {
  BackendVersionTypes,
  FetchVersionsTypes,
  FrontendVersionTypes,
  NewBackendVersionTypes,
  versionActions,
  VersionType,
} from 'src/app/store';
import { environment } from 'src/environments/environment';

@Injectable()
export class VersionEffects {
  // noinspection JSUnusedLocalSymbols
  private fetchVersionsEffect$: Observable<Action<FetchVersionsTypes>> = createEffect(
    (): Observable<Action<FetchVersionsTypes>> => this.actions$.pipe(
      ofType(versionActions.fetchVersions),
      mergeMap((): Array<Action<FetchVersionsTypes>> => [
        versionActions.fetchBackendVersion(),
        versionActions.fetchFrontendVersion(),
      ]),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  private newBackendVersionEffect$: Observable<Action<NewBackendVersionTypes>> = createEffect(
    (): Observable<Action<NewBackendVersionTypes>> => this.actions$.pipe(
      ofType(versionActions.newBackendVersion),
      map((action): string => action.backendVersion),
      mergeMap((version: string): Array<Action<NewBackendVersionTypes>> => [
        versionActions.fetchBackendVersionSuccess({ version }),
        versionActions.fetchFrontendVersion(),
      ]),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `VersionAction.FETCH_FRONTEND_VERSION` action, within this
   * we're are changing that original action observable to another one.
   *
   * This effect will trigger GET HTTP request to `/assets/version.json` which
   * contains current version of this frontend application.
   *
   * And if/when there is a new deployment of this frontend application that
   * version file is updated on build process - so we always have the latest
   * version information on that file.
   *
   * This action is triggered sequentially in each X minutes on the application
   * footer component. Also this action is triggered if/when our backend
   * version has been changed - that is checked on each backend request via
   * simple HTTP interceptor.
   */
  private fetchFrontendVersionEffect$: Observable<Action<FrontendVersionTypes>> = createEffect(
    (): Observable<Action<FrontendVersionTypes>> => this.actions$.pipe(
      ofType(versionActions.fetchFrontendVersion),
      switchMap((): Observable<Action<FrontendVersionTypes>> =>
        from(this.versionService.fetchFrontendVersion()
          .pipe(
            map((version: string): Action<VersionType.FETCH_FRONTEND_VERSION_SUCCESS> =>
              versionActions.fetchFrontendVersionSuccess({ version }),
            ),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<Action<VersionType.FETCH_FRONTEND_VERSION_FAILURE>> =>
              of(versionActions.fetchFrontendVersionFailure({ error: httpErrorResponse.error })),
            ),
          ),
        ),
      ),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `VersionAction.FETCH_BACKEND_VERSION` action, within this
   * we're are changing that original action observable to another one.
   *
   * This effect will trigger GET HTTP request to backend version API endpoint
   * which will return the current version of the backend application.
   *
   * This action is just dispatched once in application `footer` component
   * when it's initialized.
   */
  private fetchBackendVersionEffect$: Observable<Action<BackendVersionTypes>> = createEffect(
    (): Observable<Action<BackendVersionTypes>> => this.actions$.pipe(
      ofType(versionActions.fetchBackendVersion),
      switchMap((): Observable<Action<BackendVersionTypes>> =>
        from(this.versionService.fetchBackendVersion()
          .pipe(
            map((version: string): Action<VersionType.FETCH_BACKEND_VERSION_SUCCESS> =>
              versionActions.fetchBackendVersionSuccess({ version }),
            ),
            catchError((httpErrorResponse: HttpErrorResponse): Observable<Action<VersionType.FETCH_BACKEND_VERSION_FAILURE>> =>
              of(versionActions.fetchBackendVersionFailure({ error: httpErrorResponse.error })),
            ),
          ),
        ),
      ),
    ),
  );

  // noinspection JSUnusedLocalSymbols
  /**
   * NgRx effect for `VersionAction.FETCH_FRONTEND_VERSION_SUCCESS` action,
   * within this we're checking if currently running application version
   * differs from what we got to effect.
   *
   * If those versions are different it means that application has been new
   * version available and within that that use case we need to inform current
   * user that there is a new version available of this application.
   */
  private versionChangedEffect$: Observable<void> = createEffect(
    (): Observable<void> => this.actions$.pipe(
      ofType(versionActions.fetchFrontendVersionSuccess),
      map((action): string => action.version),
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

  /**
   * Constructor of the class, where we DI all services that we need to use
   * within this component and initialize needed properties.
   */
  public constructor(
    private readonly actions$: Actions,
    private readonly versionService: VersionService,
    private readonly dialog: MatDialog,
  ) {
  }
}
