import { ServerErrorInterface } from '../../shared/interfaces';
import { UserProfileInterface } from '../../auth/interfaces';
import { Role } from '../../auth/enums';

export interface AuthenticationState {
  loading: boolean;
  loggedIn: boolean;
  roles: Array<Role>;
  profile: UserProfileInterface|null;
  error: ServerErrorInterface|null;
}
