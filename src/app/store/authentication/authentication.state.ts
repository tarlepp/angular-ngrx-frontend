import { ServerErrorInterface } from '../../shared/interfaces';
import { UserDataInterface, UserProfileInterface } from '../../auth/interfaces';

export interface AuthenticationState {
  loading: boolean;
  loggedIn: boolean;
  userData: UserDataInterface|null;
  profile: UserProfileInterface|null;
  error: ServerErrorInterface|null;
}
