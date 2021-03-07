import { ActionReducer } from '@ngrx/store';
import { LocalStorageConfig, localStorageSync } from 'ngrx-store-localstorage';

/**
 * Meta reducer to keep store state in session storage. This will ensure that
 * specified parts of our store are stored to `sessionStorage` and if/when user
 * reloads (hits eg. F5) store state will be initialized with previous data.
 */
export const localStorageSyncReducer = (reducer: ActionReducer<any>): ActionReducer<any> => {
  const config: LocalStorageConfig = {
    keys: [
      {
        authentication: [
          'userData',
          'profile',
        ],
      },
      'layout',
      'version',
    ],
    rehydrate: true,
    storage: sessionStorage,
    restoreDates: false,
    storageKeySerializer: (key: string): string => `store_${key}`,
  };

  return localStorageSync(config)(reducer);
};
