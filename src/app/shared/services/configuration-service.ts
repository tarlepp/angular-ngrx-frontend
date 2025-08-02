import { ApplicationConfigurationInterface } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';

export class ConfigurationService {
  public static configuration: ApplicationConfigurationInterface;
  public static initialized: boolean = false;

  private static configurationFile: string = `/assets/config/config.${ environment.name }.json`;
  private static configurationFileLocal: string = `/assets/config/config.${ environment.name }.local.json`;

  /**
   * Method to initialize application configuration for production and
   * non-production environments. This method is called only from `main.ts`
   * file when application is booting - so that we can be sure that proper
   * configuration has been loaded _before_ application itself is started.
   */
  public static init(): Promise<void> {
    return environment.production
      ? ConfigurationService.loadConfiguration(ConfigurationService.configurationFile)
      : ConfigurationService.loadDevelopment();
  }

  /**
   * Method to load `development` configuration if such exists and fallback to
   * default configuration if there isn't development configuration. This will
   * also show warning message in console if that `development` configuration
   * is not present.
   */
  private static loadDevelopment(): Promise<void> {
    return new Promise<void>((resolve: () => void, reject: (error: Error) => void): void => {
      ConfigurationService.loadConfiguration(ConfigurationService.configurationFileLocal)
        .then((): void => resolve())
        .catch((error: string): void => {
          console.warn(error);
          console.warn(`Fallback to '${ ConfigurationService.configurationFile }' configuration file`);

          ConfigurationService.loadConfiguration(ConfigurationService.configurationFile)
            .then((): void => resolve())
            .catch((errorDefault: string): void => reject(new Error(errorDefault)));
        });
    });
  }

  /**
   * Method to load specified configuration file that is going to be used with
   * application.
   */
  private static loadConfiguration(configurationFile: string): Promise<void> {
    const ts = Math.round((new Date()).getTime() / 1000);

    return new Promise<void>((resolve: () => void, reject: (error: Error) => any): void => {
      fetch(`${ configurationFile }?t=${ ts }`)
        .then((response: Response): void => {
          response
            .json()
            .then((configuration: ApplicationConfigurationInterface): void => {
              ConfigurationService.configuration = configuration;
              ConfigurationService.initialized = true;

              resolve();
            })
            .catch((error: string): void => reject(new Error(`Invalid JSON in file '${ configurationFile }' - ${ error }`)));
        })
        .catch((error: string): void => reject(new Error(`Could not load file '${ configurationFile }' - ${ error }`)));
    });
  }
}
