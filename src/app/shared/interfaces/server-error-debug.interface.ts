/**
 * Interface definition for backend error debug trace.
 *
 *  exception
 *    Exception class name.
 *
 *  file
 *    Filename where this exception occurred.
 *
 *  line
 *    Line number where this exception occurred.
 *
 *  message
 *    Exception message.
 *
 *  trace
 *    Exception trace as an array.
 *
 *  traceString
 *    Exception trace as a string.
 */
export interface ServerErrorDebugInterface {
  exception: string;
  file: string;
  line: number;
  message: string;
  trace: any;
  traceString: string;
}
