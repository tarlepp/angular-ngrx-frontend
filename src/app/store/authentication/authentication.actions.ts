import { createAction, props } from '@ngrx/store';

import { CredentialsRequestInterface, UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { AuthenticationType } from 'src/app/store/store.type';

/**
 * Authentication store actions definitions, each of these actions will change
 * the state of this store.
 *
 * Simple usage example;
 *
 *  public constructor(private store: Store<AppState>) {
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

// Login action that triggers request to backend.
const login = createAction(AuthenticationType.LOGIN, props<{ credentials: CredentialsRequestInterface }>());

// Login success action that is triggered via effects and from application main component.
const loginSuccess = createAction(AuthenticationType.LOGIN_SUCCESS, props<{ userData: UserDataInterface }>());

// Login failure action that is triggered via effects.
const loginFailure = createAction(AuthenticationType.LOGIN_FAILURE, props<{ error: ServerErrorInterface }>());

// Profile action that triggers request to backend
const profile = createAction(AuthenticationType.PROFILE);

// Profile success action that is triggered via effects.
const profileSuccess = createAction(AuthenticationType.PROFILE_SUCCESS, props<{ profile: UserProfileInterface }>());

// Profile failure action that is triggered via effects.
const profileFailure = createAction(AuthenticationType.PROFILE_FAILURE, props<{ error: ServerErrorInterface }>());

// Logout action that triggers user logout process within application
const logout = createAction(AuthenticationType.LOGOUT, props<{ message?: string }>());

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
