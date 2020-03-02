import { Role } from '../enums';
import { UserGroupInterface } from './user-group.interface';
import { Language, Locale } from '../../shared/enums';

export interface UserProfileInterface {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  language: Language;
  locale: Locale;
  timezone: string;
  userGroups: Array<UserGroupInterface>;
  roles: Array<Role>;
}
