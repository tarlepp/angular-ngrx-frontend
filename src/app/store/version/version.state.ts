import { ServerErrorInterface } from 'src/app/shared/interfaces';

export interface VersionState {
  frontend: string;
  backend: string;
  loadingFrontend: boolean;
  loadingBackend: boolean;
  error: ServerErrorInterface|null;
}
