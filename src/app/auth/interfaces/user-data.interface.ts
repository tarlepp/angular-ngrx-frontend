import { Role } from '../enums';
import { LocalizationInterface } from '../../shared/interfaces';

export interface UserDataInterface {
  roles: Array<Role>;
  localization: LocalizationInterface;
}
