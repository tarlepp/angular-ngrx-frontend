import { RoleInterface } from './role.interface';

export interface UserGroupInterface {
  id: string;
  name: string;
  role: RoleInterface;
}
