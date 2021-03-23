import { createAction, props } from '@ngrx/store';

import { CredentialsRequestInterface, UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { AuthenticationType } from 'src/app/store/store.types';

/**
 * Authentication store actions definitions, each of these actions will change
 * the state of this store.
 *
 * Simple usage example;
 *
 *  public constructor(private store: Store) {
 *    this.subscription = new Subscription();
 *  }
 *
 *  public ngOnInit(): void {
 *    // Subscribe to user profile changes
 *    this.subscriptions
 *      .add(this.store
 *        .select(authenticationSelectors.profile)
 *        .subscribe((profile: UserProfileInterface|null): void => {
 *          console.log(profile);
 *        },
 *      );
 *
 *    // Dispatch action to fetch profile data
 *    this.store.dispatch(authenticationActions.profile());
 *  }
 *
 *  public ngOnDestroy(): void {
 *    this.subscription.unsubscribe();
 *  }
 */

// Common actions for authentication feature store
const login = createAction(AuthenticationType.LOGIN, props<{ credentials: CredentialsRequestInterface }>());
const loginSuccess = createAction(AuthenticationType.LOGIN_SUCCESS, props<{ userData: UserDataInterface }>());
const loginFailure = createAction(AuthenticationType.LOGIN_FAILURE, props<{ error: ServerErrorInterface }>());
const profile = createAction(AuthenticationType.PROFILE);
const profileSuccess = createAction(AuthenticationType.PROFILE_SUCCESS, props<{ profile: UserProfileInterface }>());
const profileFailure = createAction(AuthenticationType.PROFILE_FAILURE, props<{ error: ServerErrorInterface }>());
const logout = createAction(AuthenticationType.LOGOUT, props<{ message: string|null }>());
const resetError = createAction(AuthenticationType.RESET_ERROR);

// Export all store actions, so that those can be used easily.
export const authenticationActions = {
  login,
  loginSuccess,
  loginFailure,
  profile,
  profileSuccess,
  profileFailure,
  logout,
  resetError,
};
