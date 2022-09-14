import { createSelector, MemoizedSelector } from '@ngrx/store';

import { ServerErrorInterface } from 'src/app/shared/interfaces';

/**
 * This file contains set of helpers for NgRX usage.
 *
 * If you spot out some generic (and repeating) code in this application that
 * is related to NgRx stuff please refactor those parts and add new helper(s)
 * here.
 */

// Helper selector for any boolean value from specified feature state
export const selectBooleanValue =
  <T1, T2>(selector: MemoizedSelector<T1, T2>, property: string): MemoizedSelector<T1, boolean> =>
    createSelector(selector, (state: T2): boolean => getValue(state, property));

// Helper selector for any string value from specified feature state
export const selectStringValue =
  <T1, T2>(selector: MemoizedSelector<T1, T2>, property: string): MemoizedSelector<T1, string> =>
    createSelector(selector, (state: T2): string => getValue(state, property));

// Helper selector for `ServerErrorInterface` value from specified feature state
export const selectServerErrorValue =
  <T1, T2>(selector: MemoizedSelector<T1, T2>, property: string): MemoizedSelector<T1, ServerErrorInterface|null> =>
    createSelector(selector, (state: T2): ServerErrorInterface|null =>
      getValue(state, property));

const getValue = (state: any, property: string) => {
  if (!Object.keys(state).includes(property)) {
    throw new Error(`Property '${property}' is not defined in state ${JSON.stringify(state)}`);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return state[property];
};
