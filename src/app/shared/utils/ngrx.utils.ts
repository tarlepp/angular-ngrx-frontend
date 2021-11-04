import { createSelector, MemoizedSelector } from '@ngrx/store';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { IsLoadingAwareState, ServerErrorAwareState } from 'src/app/store/aware-states';

/**
 * This file contains set of helpers for NgRX usage.
 *
 * If you spot out some generic (and repeating) code in this application that
 * is related to NgRx stuff please refactor those parts and add new helper(s)
 * here.
 */

// Helper selector for `IsLoadingAwareState` store features `isLoading` information
// TODO try to avoid that `any` type with this...
export const selectIsLoadingAwareState =
  (selector: MemoizedSelector<IsLoadingAwareState, any>): MemoizedSelector<any, boolean> =>
    createSelector(selector, (state: IsLoadingAwareState): boolean => state.isLoading);

// Helper selector for `ServerErrorAwareState` store features `error` information
// TODO try to avoid that `any` type with this...
export const selectServerErrorAwareState =
  (selector: MemoizedSelector<ServerErrorAwareState, any>): MemoizedSelector<any, ServerErrorInterface|null> =>
    createSelector(selector, (state: ServerErrorAwareState): ServerErrorInterface|null => state.error);
