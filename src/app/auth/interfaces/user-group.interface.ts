import { RoleInterface } from 'src/app/auth/interfaces/role.interface';

/**
 * Interface to present `UserGroup` object.
 */
export interface UserGroupInterface {
  id: string;
  name: string;
  role: RoleInterface;
}
