import { enableProdMode, isDevMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { ConfigurationService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  provideNgxWebstorage,
  withNgxWebstorageConfig,
  withLocalStorage,
  withSessionStorage,
  LocalStorageService
} from 'ngx-webstorage';
import { provideTransloco, TranslocoModule } from '@jsverse/transloco';
import { languages } from 'src/app/shared/constants';
import { Language } from 'src/app/shared/enums';
import { TranslocoHttpLoader } from 'src/app/shared/Loaders';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LandingModule } from 'src/app/landing/landing.module';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from 'src/app/store/app.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { effects } from 'src/app/store/app.effects';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { jwtOptionsFactory } from 'src/app/auth/factories';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

// Load application configuration before bootstrapping application main module
ConfigurationService
  .init()
  .then((): void => {
    setTimeout((): void => {
      bootstrapApplication(
        AppComponent,
        {
          providers: [
            importProvidersFrom(BrowserModule, LandingModule, AppRoutingModule, SharedModule, StoreRouterConnectingModule.forRoot({
              stateKey: 'router',
              routerState: RouterState.Minimal,
            }), StoreModule.forRoot(reducers, {
              metaReducers,
              runtimeChecks: {
                strictStateSerializability: true,
                strictActionSerializability: true,
                strictStateImmutability: true,
                strictActionImmutability: true,
              },
            }), StoreDevtoolsModule.instrument({
              maxAge: 25,
              logOnly: environment.production,
            }), EffectsModule.forRoot([
              ...effects,
            ]), TranslocoModule, JwtModule.forRoot({
              jwtOptionsProvider: {
                provide: JWT_OPTIONS,
                useFactory: jwtOptionsFactory,
                deps: [
                  LocalStorageService,
                ],
              },
            })),
            provideHttpClient(withInterceptorsFromDi()),
            provideHttpClient(),
            provideNgxWebstorage(withNgxWebstorageConfig({
              separator: ':',
              caseSensitive: true,
            }), withLocalStorage(), withSessionStorage()),
            provideTransloco({
              config: {
                availableLangs: languages,
                defaultLang: Language.DEFAULT,
                // Remove this option if your application doesn't support changing language in runtime.
                reRenderOnLangChange: true,
                prodMode: !isDevMode(),
              },
              loader: TranslocoHttpLoader,
            }),
            provideAnimations(),
          ],
        },
      )
      .catch((error: string): void => console.error(error));
    },
    environment.production ?  2500 : 0, // In production mode we want to show that animation
    );
  })
  .catch((error: string): void => console.error(error));
