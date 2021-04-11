import { Type } from '@angular/core';

import { LocalDatePipe } from 'src/app/shared/pipes/local-date.pipe';
import { LocalNumberPipe } from 'src/app/shared/pipes/local-number.pipe';

export * from 'src/app/shared/pipes/local-date.pipe';
export * from 'src/app/shared/pipes/local-number.pipe';

export const pipes: Array<Type<any>> = [
  LocalDatePipe,
  LocalNumberPipe,
];
