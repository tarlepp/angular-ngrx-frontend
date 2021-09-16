import { RouterReducerState, getSelectors } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';

/**
 * Selectors for `RouterState` store.
 *
 * Simple usage example;
 *
 *  public constructor(private store: Store) {
 *    this.subscription = new Subscription();
 *  }
 *
 *  public ngOnInit(): void {
 *    this.subscription
 *      .add(this.store
 *        .select(routerSelectors.selectCurrentRoute)
 *        .subscribe((currentRoute: any): void => {
 *          ...
 *        }),
 *      );
 *  }
 *
 *  public ngOnDestroy(): void {
 *    this.subscription.unsubscribe();
 *  }
 */

// Feature selector for `layout` store
const selectFeatureSelector = createFeatureSelector<RouterReducerState>('router');

export const routerSelectors  = {
  ...getSelectors(selectFeatureSelector),
};
