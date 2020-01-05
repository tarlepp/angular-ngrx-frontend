import { Role } from '../enums';
import { UserGroupInterface } from './user-group.interface';

export interface UserProfileInterface {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userGroups: Array<UserGroupInterface>;
  roles: Array<Role>;
}
