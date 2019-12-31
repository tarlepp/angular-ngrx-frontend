import { Role } from '../enums';

export interface UserProfileInterface {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userGroups: Array<{
    id: string;
    name: string;
    role: {
      id: Role,
    }
  }>;
  roles: Array<Role>;
}
