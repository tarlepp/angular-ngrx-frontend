import { AnonymousGuard } from 'src/app/auth/guards/anonymous.guard';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';
import { RoleAdminGuard } from 'src/app/auth/guards/role-admin.guard';
import { RoleALoggedGuard } from 'src/app/auth/guards/role-logged.guard';
import { RoleRootGuard } from 'src/app/auth/guards/role-root.guard';
import { RoleUserGuard } from 'src/app/auth/guards/role-user.guard';

export * from 'src/app/auth/guards/anonymous.guard';
export * from 'src/app/auth/guards/authentication.guard';
export * from 'src/app/auth/guards/role-admin.guard';
export * from 'src/app/auth/guards/role-logged.guard';
export * from 'src/app/auth/guards/role-root.guard';
export * from 'src/app/auth/guards/role-user.guard';

export const Guards = [
  AnonymousGuard,
  AuthenticationGuard,
  RoleAdminGuard,
  RoleALoggedGuard,
  RoleRootGuard,
  RoleUserGuard,
];
