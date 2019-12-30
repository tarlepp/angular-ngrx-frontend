import { ServerErrorInterface } from '../../shared/interfaces';

export interface AuthenticationState {
  loading: boolean;
  loggedIn: boolean;
  roles: Array<string>;
  error: ServerErrorInterface|null;
}
