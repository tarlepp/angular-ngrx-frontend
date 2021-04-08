import { Type } from '@angular/core';

import { AutoFocusDirective } from 'src/app/shared/directives/auto-focus.directive';
import { ExcludedRoleDirective } from 'src/app/shared/directives/excluded-role.directive';
import { RequiredRoleDirective } from 'src/app/shared/directives/required-role.directive';
import { IsLoggedInDirective } from 'src/app/shared/directives/is-logged-in.directive';

export const directives: Array<Type<any>> = [
  AutoFocusDirective,
  ExcludedRoleDirective,
  IsLoggedInDirective,
  RequiredRoleDirective,
];
