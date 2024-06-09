import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JWT_OPTIONS, JwtModule } from '@auth0/angular-jwt';
import { EffectsModule } from '@ngrx/effects';
import { RouterState, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LocalStorageService, NgxWebstorageModule } from 'ngx-webstorage';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AppComponent } from 'src/app/app.component';
import { registerLocales } from 'src/app/app.locales';
import { jwtOptionsFactory } from 'src/app/auth/factories';
import { LandingModule } from 'src/app/landing/landing.module';
import {
  ErrorMessageComponent,
  FooterComponent,
  HeaderComponent,
  VersionChangeDialogComponent,
} from 'src/app/shared/components';
import { Language } from 'src/app/shared/enums';
import { httpLoaderFactory } from 'src/app/shared/factories';
import { SharedModule } from 'src/app/shared/shared.module';
import { effects } from 'src/app/store/app.effects';
import { metaReducers, reducers } from 'src/app/store/app.reducers';
import { environment } from 'src/environments/environment';

registerLocales();

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    ErrorMessageComponent,
    VersionChangeDialogComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
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
      defaultLanguage: Language.DEFAULT,
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxWebstorageModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [
          LocalStorageService,
        ],
      },
    }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
})

export class AppModule {
}
