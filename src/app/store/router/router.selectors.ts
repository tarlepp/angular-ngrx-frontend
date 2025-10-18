import { RouterReducerState, getRouterSelectors } from '@ngrx/router-store';
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
 *        .subscribe((currentRoute: ActivatedRoute): void => {
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
const selectFeature = createFeatureSelector<RouterReducerState>('router');

export const routerSelectors = {
  ...getRouterSelectors(selectFeature),
};
