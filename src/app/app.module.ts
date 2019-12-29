import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxWebstorageModule } from 'ngx-webstorage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { LandingModule } from './landing/landing.module';
import { FooterComponent, HeaderComponent } from './shared/components';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    LandingModule,
    AppRoutingModule,
    SharedModule,
    NgxWebstorageModule.forRoot(),
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ],
})

export class AppModule { }
