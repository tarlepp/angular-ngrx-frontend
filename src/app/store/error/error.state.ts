import { ServerErrorInterface } from 'src/app/shared/interfaces';

export interface ErrorState {
  errorSnackbar: ServerErrorInterface|null;
}
