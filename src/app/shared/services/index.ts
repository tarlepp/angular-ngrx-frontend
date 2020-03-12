import { SnackbarService } from 'src/app/shared/services/snackbar-service';
import { VersionService } from 'src/app/shared/services/version.service';

export * from 'src/app/shared/services/configuration-service';
export * from 'src/app/shared/services/snackbar-service';
export * from 'src/app/shared/services/version.service';

export const Services = [
  SnackbarService,
  VersionService,
];
