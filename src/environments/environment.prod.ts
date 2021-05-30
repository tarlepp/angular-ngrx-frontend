import packageInfo from 'package.json';
import { EnvironmentInterface } from 'src/app/shared/interfaces';

export const environment: EnvironmentInterface = {
  production: true,
  name: 'prod',
  version: packageInfo.version,
};
