import { ErrorMessageComponent } from 'src/app/shared/components/error-message/error-message.component';

export * from 'src/app/shared/components/error-message/error-message.component';
export * from 'src/app/shared/components/footer/footer.component';
export * from 'src/app/shared/components/header/header.component';
export * from 'src/app/shared/components/oops/oops.component';

// Only export components that are used commonly within another modules
export const Components = [
  ErrorMessageComponent,
];
