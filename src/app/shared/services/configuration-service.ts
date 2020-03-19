import { ApplicationConfigurationInterface } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';

export class ConfigurationService {
  public static configuration: undefined|ApplicationConfigurationInterface;
  public static initialized: boolean;

  private static configurationFile: string = `/assets/config/config.${ environment.name }.json`;
  private static configurationFileLocal: string = `/assets/config/config.${ environment.name }.local.json`;

  public constructor() {
    ConfigurationService.initialized = false;
  }

  public static loadStatic(): Promise<void> {
    return environment.production
      ? ConfigurationService.loadConfiguration(ConfigurationService.configurationFile)
      : ConfigurationService.loadDevelopment();
  }

  private static loadDevelopment(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (s: string) => void): void => {
      ConfigurationService.loadConfiguration(ConfigurationService.configurationFileLocal)
        .then((): void => resolve())
        .catch((error: string): void => {
          console.warn(error);
          console.warn(`Fallback to '${ ConfigurationService.configurationFile }' configuration file`);

          ConfigurationService.loadConfiguration(ConfigurationService.configurationFile)
            .then((): void => resolve())
            .catch((errorDefault: string): void => reject(errorDefault));
        });
    });
  }

  private static loadConfiguration(configurationFile: string): Promise<void> {
    const ts = Math.round((new Date()).getTime() / 1000);

    return new Promise<void>((resolve: () => void, reject: (s: string) => any): void => {
      fetch(`${ configurationFile }?t=${ ts }`)
        .then((response: Response): void => {
          response
            .json()
            .then((configuration: ApplicationConfigurationInterface): void => {
              ConfigurationService.configuration = configuration;
              ConfigurationService.initialized = true;

              resolve();
            })
            .catch((error: any): void => reject(`Invalid JSON in file '${ configurationFile }': ${ error }`));
        })
        .catch((error: any): void => reject(`Could not load file '${ configurationFile }': ${ error }`));
    });
  }
}
