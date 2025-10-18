import { createAction, props } from '@ngrx/store';

import { Language, Locale, Theme, Viewport } from 'src/app/shared/enums';
import { DictionaryInterface, LocalizationInterface } from 'src/app/shared/interfaces';
import { LayoutType } from 'src/app/store/store.types';

/**
 * Layout store actions definitions, each of these actions will change
 * the state of this store.
 *
 * Simple usage example;
 *
 *  public constructor(private store: Store) {
 *    this.subscription = new Subscription();
 *  }
 *
 *  public ngOnInit(): void {
 *    // Subscribe to language changes
 *    this.subscriptions
 *      .add(this.store
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
 *    this.store.dispatch(layoutActions.changeLanguage({ language }));
 *  }
 */

// Common actions for layout feature store
const changeLanguage = createAction(LayoutType.CHANGE_LANGUAGE, props<{ language: Language }>());
const changeLocale = createAction(LayoutType.CHANGE_LOCALE, props<{ locale: Locale }>());
const changeTimezone = createAction(LayoutType.CHANGE_TIMEZONE, props<{ timezone: string }>());
const changeTheme = createAction(LayoutType.CHANGE_THEME, props<{ theme: Theme }>());
const setLanguage = createAction(LayoutType.SET_LANGUAGE, props<{ language: Language }>());
const scrollTo = createAction(LayoutType.SCROLL_TO, props<{ anchor: string, instant?: boolean }>());

/**
 * Action to trigger browser to scroll to top of the page. This action is
 * dispatched with every `RouterEvent.NavigationEnd` event.
 */
const scrollToTop = createAction(LayoutType.SCROLL_TO_TOP);

// Action to trigger `language`, `locale` and `timezone` change in application
const updateLocalization = createAction(LayoutType.UPDATE_LOCALIZATION, props<{ localization: LocalizationInterface }>());

const snackbarMessage = createAction(
  LayoutType.SNACKBAR_MESSAGE,
  props<{ message: string, duration?: number, params?: DictionaryInterface<string> }>(),
);

/**
 * Action to change viewport - This is to be used only in our application
 * main component, where we detect viewport changes.
 *
 * @internal
 */
const changeViewport = createAction(LayoutType.CHANGE_VIEWPORT, props<{ viewport: Viewport }>());

/**
 * Action to clear layout store current `scrollTo` information.
 *
 * @internal
 */
const clearScrollTo = createAction(LayoutType.CLEAR_SCROLL_TO);

// Export all `Layout` store actions, so that those can be used easily.
export const layoutActions = {
  changeLanguage,
  changeLocale,
  changeTimezone,
  changeTheme,
  setLanguage,
  scrollTo,
  scrollToTop,
  updateLocalization,
  snackbarMessage,
  clearScrollTo,
  changeViewport,
};
