import { Role } from 'src/app/auth/enums';
import { UserGroupInterface } from 'src/app/auth/interfaces/user-group.interface';
import { Language, Locale } from 'src/app//shared/enums';

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
