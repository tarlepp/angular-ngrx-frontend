import {ErrorMessageServerInterface} from 'src/app/shared/interfaces/error-message-server.interface';

export interface ErrorMessageClientInterface extends ErrorMessageServerInterface {
  messageText: string;
  messageProperty: string;
  messageTextClient?: string|null;
  messagePropertyClient?: string|null;
}
