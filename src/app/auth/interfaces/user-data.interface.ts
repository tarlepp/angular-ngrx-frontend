import { Role } from 'src/app/auth/enums';
import { LocalizationInterface } from 'src/app/shared/interfaces';

export interface UserDataInterface {
  roles: Array<Role>;
  localization: LocalizationInterface;
}
