import { ServerErrorDebugInterface } from 'src/app/shared/interfaces/server-error-debug.interface';

/**
 * Interface definition for backend errors.
 *
 *  code
 *    Error code, could be same as status or not - depending the error itself.
 *
 *  message
 *    Error message.
 *
 *  status
 *    HTTP status code.
 *
 *  statusText
 *    HTTP status code text.
 *
 *  debug
 *    Debug information, this is only present if backend is running on
 *    development mode.
 */
export interface ServerErrorInterface {
  code: number;
  message: string;
  status: number;
  statusText: string;
  debug?: Array<ServerErrorDebugInterface>;
}
