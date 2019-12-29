import { environment } from '../../../environments/environment';
import { ApplicationConfigurationInterface } from '../interfaces';

export class ConfigurationService {
  public static configuration: undefined|ApplicationConfigurationInterface;
  public static initialized: boolean;

  private static configurationFile = `/assets/config/config.${environment.name}.json`;
  private static configurationFileLocal = `/assets/config/config.${environment.name}.local.json`;

  public constructor() {
    ConfigurationService.initialized = false;
  }

  public static loadStatic(): Promise<void> {
    return environment.production ? this.loadConfiguration(this.configurationFile) : this.loadDevelopment();
  }

  private static loadDevelopment() {
    return new Promise<void>((resolve, reject): void => {
      this.loadConfiguration(this.configurationFileLocal)
        .then((): void => resolve())
        .catch((error: string): void => {
          console.warn(error);
          console.warn(`Fallback to '${this.configurationFile}' configuration file`);

          this.loadConfiguration(this.configurationFile)
            .then((): void => resolve())
            .catch((error: string): void => reject(error))
        })
    });
  }

  private static loadConfiguration(configurationFile: string): Promise<void> {
    const ts = Math.round((new Date()).getTime() / 1000);

    return new Promise<void>((resolve, reject): void => {
      fetch(`${configurationFile}?t=${ts}`)
        .then((response) => {
          response
            .json()
            .then((configuration: ApplicationConfigurationInterface): void => {
              ConfigurationService.configuration = configuration;
              ConfigurationService.initialized = true;

              resolve();
            })
            .catch((response: any): void => reject(`Invalid JSON in file '${configurationFile}': ${response}`));
        })
        .catch((response: any): void => reject(`Could not load file '${configurationFile}': ${response}`));
    });
  }
}
