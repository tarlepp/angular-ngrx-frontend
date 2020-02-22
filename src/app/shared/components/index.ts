import { ErrorMessageComponent } from './error-message/error-message.component';

export * from './error-message/error-message.component';
export * from './footer/footer.component';
export * from './header/header.component';

// Only export components that are used commonly within another modules
export const Components = [
  ErrorMessageComponent,
];
