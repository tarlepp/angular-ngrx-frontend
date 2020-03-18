/**
 * Interface definition for "generic" error message that is used on custom
 * `app-error-message` component.
 *
 *  message
 *    Backend error message OR translated error message from frontend
 *    application - see that `app-error-message` component for details.
 *    Also note that backend error message could be translated one.
 *
 *  property
 *    Name of the backend property which caused this error.
 *
 *  debug
 *    This is only present if using non-production version.
 */
export interface ErrorMessageInterface {
  message: string;
  property: string;
  debug?: string|null; // This is only present if using non-production version
}
