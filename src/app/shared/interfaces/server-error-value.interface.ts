import { ServerErrorInterface } from 'src/app/shared/interfaces/server-error.interface';

export interface ServerErrorValueInterface {
  [key: string]: ServerErrorInterface;
}
