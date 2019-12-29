import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

const MaterialModules = [
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...MaterialModules,
  ],
  exports: [
    ...MaterialModules,
  ]
})

export class MaterialModule { }
