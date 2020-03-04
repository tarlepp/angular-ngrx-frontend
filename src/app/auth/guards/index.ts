import { AnonymousGuard } from 'src/app/auth/guards/anonymous.guard';
import { AuthenticationGuard } from 'src/app/auth/guards/authentication.guard';

export * from 'src/app/auth/guards/anonymous.guard';
export * from 'src/app/auth/guards/authentication.guard';

export const Guards = [
  AnonymousGuard,
  AuthenticationGuard,
];
