import { AutoFocusDirective } from 'src/app/shared/directives/auto-focus.directive';
import { ExcludedRoleDirective } from 'src/app/shared/directives/excluded-role.directive';
import { RequiredRoleDirective } from 'src/app/shared/directives/required-role.directive';
import { IsLoggedInDirective } from 'src/app/shared/directives/is-logged-in.directive';
import { RequiredSomeRoleDirective } from 'src/app/shared/directives/required-some-role.directive';

export const directives = [
  AutoFocusDirective,
  ExcludedRoleDirective,
  IsLoggedInDirective,
  RequiredRoleDirective,
  RequiredSomeRoleDirective,
];
