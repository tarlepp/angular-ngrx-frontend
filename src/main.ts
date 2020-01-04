import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'hammerjs';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { ConfigurationService } from './app/shared/services';

if (environment.production) {
  enableProdMode();
}

// Load application configuration before bootstrapping application main module
ConfigurationService
  .loadStatic()
  .then((): void => {
    setTimeout((): void => {
      platformBrowserDynamic()
        .bootstrapModule(AppModule)
        .catch((error: string): void => console.error(error));
      },
      2500,
    );
  })
  .catch((error: string): void => console.error(error));
