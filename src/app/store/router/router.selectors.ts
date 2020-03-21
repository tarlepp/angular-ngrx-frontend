import { RouterReducerState, getSelectors } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';

/**
 * Selectors for `RouterState` store.
 *
 * Simple usage example;
 *
 *  public constructor(private routerStore: Store<RouterReducerState>) {
 *    this.subscription = new Subscription();
 *  }
 *
 *  public ngOnInit(): void {
 *    this.subscription
 *      .add(this.routerStore
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

const routerSelector = createFeatureSelector<RouterReducerState>('router');

export const routerSelectors  = {
  ...getSelectors(routerSelector),
};
