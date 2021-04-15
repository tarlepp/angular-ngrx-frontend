import { AutoFocusDirective } from 'src/app/shared/directives/auto-focus.directive';
import { HasAllRolesDirective } from 'src/app/shared/directives/has-all-roles.directive';
import { HasNotRoleDirective } from 'src/app/shared/directives/has-not-role.directive';
import { HasNotSomeRoleDirective } from 'src/app/shared/directives/has-not-some-role.directive';
import { HasRoleDirective } from 'src/app/shared/directives/has-role.directive';
import { HasSomeRoleDirective } from 'src/app/shared/directives/has-some-role.directive';
import { IsLoggedInDirective } from 'src/app/shared/directives/is-logged-in.directive';

export const directives = [
  AutoFocusDirective,
  HasAllRolesDirective,
  HasNotRoleDirective,
  HasNotSomeRoleDirective,
  HasRoleDirective,
  HasSomeRoleDirective,
  IsLoggedInDirective,
];
