import { Type } from '@angular/core';

import { AutoFocusDirective } from 'src/app/shared/directives/auto-focus.directive';
import { ExcludedRoleDirective } from 'src/app/shared/directives/excluded-role.directive';
import { RequiredRoleDirective } from 'src/app/shared/directives/required-role.directive';

export const directives: Array<Type<any>> = [
  AutoFocusDirective,
  ExcludedRoleDirective,
  RequiredRoleDirective,
];
