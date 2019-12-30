import { ServerErrorInterface } from '../../shared/interfaces';
import { UserProfileInterface } from '../../auth/interfaces';

export interface AuthenticationState {
  loading: boolean;
  loggedIn: boolean;
  roles: Array<string>;
  profile: UserProfileInterface|null;
  error: ServerErrorInterface|null;
}
