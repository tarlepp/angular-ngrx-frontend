import { createSelector, MemoizedSelector } from '@ngrx/store';

import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { IsLoadingAwareState } from 'src/app/store/aware-states';

/**
 * This file contains set of helpers for NgRX usage.
 *
 * If you spot out some generic (and repeating) code in this application that
 * is related to NgRx stuff please refactor those parts and add new helper(s)
 * here.
 *
 * TODO try to avoid that `any` type with these...
 */

// Helper selector for any boolean value from specified feature state
export const selectBooleanValue =
  (selector: MemoizedSelector<any, any>, property: string): MemoizedSelector<any, boolean> =>
    createSelector(selector, (state: IsLoadingAwareState|any): boolean => getValue<boolean>(state, property));

// Helper selector for any string value from specified feature state
export const selectStringValue =
  (selector: MemoizedSelector<any, any>, property: string): MemoizedSelector<any, string> =>
    createSelector(selector, (state: any): string => getValue<string>(state, property));

// Helper selector for `ServerErrorInterface` value from specified feature state
export const selectServerErrorValue =
  (selector: MemoizedSelector<any, any>, property: string): MemoizedSelector<any, ServerErrorInterface|null> =>
    createSelector(selector, (state: any): ServerErrorInterface|null =>
      getValue<ServerErrorInterface|null>(state, property));

const getValue = <T>(state: any, property: string): T => {
  if (!Object.keys(state).includes(property)) {
    throw new Error(`Property '${property}' is not defined in state ${JSON.stringify(state)}`);
  }

  return state[property];
};
