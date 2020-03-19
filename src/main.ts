import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from 'src/app/app.module';
import { ConfigurationService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

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
      environment.production ?  2500 : 0, // In production mode we want to show that animation
    );
  })
  .catch((error: string): void => console.error(error));
