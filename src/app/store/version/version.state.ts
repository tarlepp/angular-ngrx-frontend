import { ServerErrorInterface } from 'src/app/shared/interfaces';

/**
 * Interface definition for application version store contents.
 *
 *  frontend
 *    Frontend application version.
 *
 *  backend
 *    Backend application version.
 *
 *  loadingFrontend
 *    Is frontend application version loading or not.
 *
 *  loadingBackend
 *    Is backend application version loading or not.
 *
 *  error
 *    Latest error from loading frontend/backend version.
 */
export interface VersionState {
  frontend: string;
  backend: string;
  isLoadingFrontend: boolean;
  isLoadingBackend: boolean;
  error: ServerErrorInterface|null;
}
