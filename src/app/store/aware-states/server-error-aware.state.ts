import { ServerErrorInterface } from 'src/app/shared/interfaces';

export interface ServerErrorAwareState {
  error: ServerErrorInterface|null;
}
