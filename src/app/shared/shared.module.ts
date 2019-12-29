import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { Components } from './components';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    ...Components,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  exports: [
    ...Components,
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
  ],
})

export class SharedModule { }
