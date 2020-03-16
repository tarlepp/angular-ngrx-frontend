import { Role } from 'src/app/auth/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';

/**
 * Interface to present user data that is stored to Json Web Token (JWT).
 */
export interface UserDataInterface {
  roles: Array<Role>;
  localization: LocalizationInterface;
}
