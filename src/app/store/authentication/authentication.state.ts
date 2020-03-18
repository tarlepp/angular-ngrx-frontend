import { UserDataInterface, UserProfileInterface } from 'src/app/auth/interfaces';
import { ServerErrorInterface } from 'src/app/shared/interfaces';

export interface AuthenticationState {
  loading: boolean;
  loggedIn: boolean;
  userData: UserDataInterface|null;
  profile: UserProfileInterface|null;
  error: ServerErrorInterface|null;
}
