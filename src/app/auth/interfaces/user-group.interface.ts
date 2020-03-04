import { RoleInterface } from 'src/app/auth/interfaces/role.interface';

export interface UserGroupInterface {
  id: string;
  name: string;
  role: RoleInterface;
}
