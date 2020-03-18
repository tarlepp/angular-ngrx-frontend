/**
 * Interface definition for client side error messages - server side error
 * messages are converted to this one on `app-error-message` component.
 *
 *  code
 *    UUID v4 error code from backend.
 *
 *  message
 *    Backend message for this error, note that this might be translated one.
 *
 *  target
 *    Target class / object where this error occurred.
 *
 *  propertyPath
 *    Property path of this error, usually just one level but may contain
 *    multiple levels that are separated by dot (.) character.
 */
export interface ErrorMessageServerInterface {
  code: string;
  message: string;
  target: string;
  propertyPath: string;
}
