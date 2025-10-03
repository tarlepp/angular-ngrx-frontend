import { ErrorMessageServerInterface } from 'src/app/shared/interfaces/error-message-server.interface';

/**
 * Interface definition for client side error messages - server side error
 * messages are converted to this one on `app-error-message` component.
 *
 *  messageText
 *    Error message from backend.
 *
 *  messageProperty
 *    Property message from backend.
 *
 *  messageTextClient
 *    If not null, frontend application has translation for this
 *
 *  messagePropertyClient
 *    If not null, frontend application has translation for this
 */
export interface ErrorMessageClientInterface extends ErrorMessageServerInterface {
  messageText: string;
  messageProperty: string;
  messageTextClient?: string|null;
  messagePropertyClient?: string|null;
}
