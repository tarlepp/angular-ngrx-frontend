import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { enableProdMode, isDevMode, importProvidersFrom } from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withDebugTracing, withPreloading } from '@angular/router';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { provideTransloco, TranslocoModule } from '@jsverse/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, RouterState } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  provideNgxWebstorage,
  withNgxWebstorageConfig,
  withLocalStorage,
  withSessionStorage,
  LocalStorageService,
} from 'ngx-webstorage';

import { AppComponent } from 'src/app/app.component';
import { appRoutes } from 'src/app/app.routes';
import { jwtOptionsFactory } from 'src/app/auth/factories';
import { languages } from 'src/app/shared/constants';
import { Language } from 'src/app/shared/enums';
import { httpInterceptors } from 'src/app/shared/interceptors';
import { TranslocoHttpLoader } from 'src/app/shared/Loaders';
import { ConfigurationService } from 'src/app/shared/services';
import { effects } from 'src/app/store/app.effects';
import { reducers, metaReducers } from 'src/app/store/app.reducers';
import { environment } from 'src/environments/environment';

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
            importProvidersFrom(
              BrowserModule,
              StoreRouterConnectingModule.forRoot({
                stateKey: 'router',
                routerState: RouterState.Minimal,
              }),
              StoreModule.forRoot(reducers, {
                metaReducers,
                runtimeChecks: {
                  strictStateSerializability: true,
                  strictActionSerializability: true,
                  strictStateImmutability: true,
                  strictActionImmutability: true,
                },
              }),
              StoreDevtoolsModule.instrument({
                maxAge: 25,
                logOnly: environment.production,
              }),
              EffectsModule.forRoot([
                ...effects,
              ]),
              TranslocoModule,
              JwtModule.forRoot({
                jwtOptionsProvider: {
                  provide: JWT_OPTIONS,
                  useFactory: jwtOptionsFactory,
                  deps: [
                    LocalStorageService,
                  ],
                },
              }),
            ),
            provideRouter(
              appRoutes,
              withPreloading(PreloadAllModules),
              withDebugTracing(),
            ),
            provideHttpClient(
              withInterceptorsFromDi(),
            ),
            provideNgxWebstorage(
              withNgxWebstorageConfig({
                separator: ':',
                caseSensitive: true,
              }),
              withLocalStorage(),
              withSessionStorage(),
            ),
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
            httpInterceptors,
          ],
        },
      )
      .catch((error: string): void => console.error(error));
    },
    environment.production ?  2500 : 0, // In production mode we want to show that animation
    );
  })
  .catch((error: string): void => console.error(error));
