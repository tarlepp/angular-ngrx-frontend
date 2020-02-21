import {ErrorMessageServerInterface} from "./error-message-server.interface";

export interface ErrorMessageClientInterface extends ErrorMessageServerInterface {
  textTag: string;
}
