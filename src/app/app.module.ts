import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { environment } from '../environments/environment';
import { registerLocales } from './app.locales';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { HttpLoaderFactory } from './shared/factories';
import { LandingModule } from './landing/landing.module';
import { FooterComponent, HeaderComponent } from './shared/components';
import { AuthModule } from './auth/auth.module';
import { metaReducers, reducers, effects } from './store';

registerLocales();

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AuthModule,
    LandingModule,
    AppRoutingModule,
    SharedModule,
    NgxWebstorageModule.forRoot(),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      routerState: RouterState.Minimal,
    }),
    StoreModule.forRoot(
      reducers,
      {
        metaReducers,
        runtimeChecks: {
          strictStateSerializability: true,
          strictActionSerializability: true,
          strictStateImmutability: true,
          strictActionImmutability: true,
        },
      },
    ),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    EffectsModule.forRoot([
      ...effects,
    ]),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ],
})

export class AppModule { }
