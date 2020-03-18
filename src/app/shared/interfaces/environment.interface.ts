/**
 * Interface definition for our application environment "variables", this is
 * used to "type cast" following files;
 *  - src/environments/environment.prod.ts
 *  - src/environments/environment.ts
 *
 *  production
 *    Is application in production more or not
 *
 *  name
 *    Environment name; dev, prod, etc.
 *
 *  version
 *    Application version, read from package.json on build time
 */
export interface EnvironmentInterface {
  production: boolean;
  name: string;
  version: string;
}
