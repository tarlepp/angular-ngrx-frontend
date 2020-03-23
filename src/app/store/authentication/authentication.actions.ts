import { createAction, props } from '@ngrx/store';

import { CredentialsRequestInterface, UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { AuthenticationAction } from 'src/app/store/store.action';

/**
 * Authentication store actions definitions, each of these actions will change
 * the state of this store.
 *
 * Simple usage example;
 *
 *  public constructor(private authenticationStore: Store<AuthenticationState>) {
 *    this.subscription = new Subscription();
 *  }
 *
 *  public ngOnInit(): void {
 *    // Subscribe to user profile changes
 *    this.subscriptions
 *      .add(this.authenticationStore
 *        .select(authenticationSelectors.profile)
 *        .subscribe((profile: UserProfileInterface|null): void => {
 *          console.log(profile);
 *        },
 *      );
 *
 *    // Dispatch action to fetch profile data
 *    this.authenticationStore.dispatch(authenticationActions.profile());
 *  }
 *
 *  public ngOnDestroy(): void {
 *    this.subscription.unsubscribe();
 *  }
 */

// Login action that triggers request to backend.
const login = createAction(AuthenticationAction.LOGIN, props<{ credentials: CredentialsRequestInterface }>());

// Login success action that is triggered via effects.
const loginSuccess = createAction(AuthenticationAction.LOGIN_SUCCESS, props<{ userData: UserDataInterface }>());

// Login failure action that is triggered via effects.
const loginFailure = createAction(AuthenticationAction.LOGIN_FAILURE, props<{ error: ServerErrorInterface }>());

// Profile action that triggers request to backend
const profile = createAction(AuthenticationAction.PROFILE);

// Profile success action that is triggered via effects.
const profileSuccess = createAction(AuthenticationAction.PROFILE_SUCCESS, props<{ profile: UserProfileInterface }>());

// Profile failure action that is triggered via effects.
const profileFailure = createAction(AuthenticationAction.PROFILE_FAILURE, props<{ error: ServerErrorInterface }>());

// Logout action that triggers user logout process within application
const logout = createAction(AuthenticationAction.LOGOUT, props<{ message?: string }>());

// Export all store actions, so that those can be used easily.
export const authenticationActions = {
  login,
  loginSuccess,
  loginFailure,
  profile,
  profileSuccess,
  profileFailure,
  logout,
};
