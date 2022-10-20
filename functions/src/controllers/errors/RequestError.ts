type ErrorCode =
  | 'user-needs-email'
  | 'request-not-found'
  | 'request-exists'
  | 'request-expired'
  | 'verification-failed';

export class RequestError extends Error {
  constructor(code: ErrorCode) {
    super(code);
    this.code = code;
  }

  code: string;
}
