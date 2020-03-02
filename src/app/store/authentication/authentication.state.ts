import { ServerErrorInterface } from 'src/app/shared/interfaces';
import { UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';

export interface AuthenticationState {
  loading: boolean;
  loggedIn: boolean;
  userData: UserDataInterface|null;
  profile: UserProfileInterface|null;
  error: ServerErrorInterface|null;
}
