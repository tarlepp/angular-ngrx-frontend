import { UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { IsLoadingAwareState, ServerErrorAwareState } from 'src/app/store/aware-states';

/**
 * Interface definition for our authentication store contents.
 *
 *  isLoading
 *    Is store in "loading" state or not, this will be `true` when we're
 *    making login or fetching users profile.
 *
 *  isLoggedIn
 *    Is current user logged in to application or not.
 *
 *  userData
 *    User data from Json Web Token (JWT), can be null.
 *
 *  profile
 *    User profile data from backend, can be null.
 *
 *  error
 *    Possible error from backend, can be null.
 */
export interface AuthenticationState extends IsLoadingAwareState, ServerErrorAwareState {
  isLoggedIn: boolean;
  userData: UserDataInterface|null;
  profile: UserProfileInterface|null;
}
