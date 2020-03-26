import { createAction, props } from '@ngrx/store';

import { Language, Locale, Viewport } from 'src/app/shared/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';
import { LayoutAction } from 'src/app/store/store.action';

/**
 * Layout store actions definitions, each of these actions will change
 * the state of this store.
 *
 * Simple usage example;
 *
 *  public constructor(private layoutStore: Store<LayoutState>) {
 *    this.subscription = new Subscription();
 *  }
 *
 *  public ngOnInit(): void {
 *    // Subscribe to language changes
 *    this.subscriptions
 *      .add(this.layoutStore
 *        .select(layoutSelectors.language)
 *        .subscribe((language: Language): void => console.log(language)),
 *      );
 *  }
 *
 *  public ngOnDestroy(): void {
 *    this.subscription.unsubscribe();
 *  }
 *
 *  public changeLanguage(language: Language): void {
 *    // Dispatch action to change language
 *    this.layoutStore.dispatch(layoutActions.changeLanguage({ language }));
 *  }
 */

// Action to trigger language change in application.
const changeLanguage = createAction(LayoutAction.CHANGE_LANGUAGE, props<{ language: Language }>());

// Action to trigger locale change in application.
const changeLocale = createAction(LayoutAction.CHANGE_LOCALE, props<{ locale: Locale }>());

// Action to trigger timezone change in application.
const changeTimezone = createAction(LayoutAction.CHANGE_TIMEZONE, props<{ timezone: string }>());

/**
 * Action to change viewport - This is to be used only in our application
 * main component, where we detect viewport changes.
 *
 * @internal
 */
const changeViewport = createAction(LayoutAction.CHANGE_VIEWPORT, props<{ viewport: Viewport }>());

// Action to trigger `language`, `locale` and `timezone` change in application.
const updateLocalization = createAction(LayoutAction.UPDATE_LOCALIZATION, props<{ localization: LocalizationInterface }>());

// Action to trigger browser to scroll specified anchor.
const scrollTo = createAction(LayoutAction.SCROLL_TO, props<{ anchor: string }>());

/**
 * Action to trigger browser to scroll to top of the page. This action is
 * dispatched with every `RouterEvent.NavigationEnd` event.
 */
const scrollToTop = createAction(LayoutAction.SCROLL_TO_TOP);

/**
 * Action to clear layout store current `scrollTo` information.
 *
 * @internal
 */
const clearScrollTo = createAction(LayoutAction.CLEAR_SCROLL_TO);

// Export all `Layout` store actions, so that those can be used easily.
export const layoutActions = {
  changeLanguage,
  changeLocale,
  changeTimezone,
  updateLocalization,
  changeViewport,
  scrollTo,
  scrollToTop,
  clearScrollTo,
};
