import { ServerErrorDebugInterface } from './server-error-debug.interface';

export interface ServerErrorInterface {
  code: number;
  message: string;
  status: number;
  statusText: string;
  debug?: Array<ServerErrorDebugInterface>;
}
