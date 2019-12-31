import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { Components } from './components';
import { HttpInterceptors } from './interceptors';
import { Services } from './services';
import { MaterialModule } from './material/material.module';

@NgModule({
  declarations: [
    ...Components,
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    ...Components,
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    ...HttpInterceptors,
    ...Services,
  ],
})

export class SharedModule { }
