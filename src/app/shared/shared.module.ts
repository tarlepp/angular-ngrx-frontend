import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from "@angular/flex-layout";

@NgModule({
  declarations: [],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
  ],
  exports: [
    BrowserAnimationsModule,
    CommonModule,
    FlexLayoutModule,
  ],
})

export class SharedModule { }
