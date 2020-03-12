import { ServerErrorInterface } from 'src/app/shared/interfaces';

export interface VersionState {
  frontend: string;
  loading: boolean;
  error: ServerErrorInterface|null;
}
