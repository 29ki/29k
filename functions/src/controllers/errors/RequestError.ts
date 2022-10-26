type RequestErrorCode =
  | 'user-needs-email'
  | 'request-not-found'
  | 'request-exists'
  | 'request-declined'
  | 'verification-failed'
  | 'verification-already-used';

export class RequestError extends Error {
  constructor(code: RequestErrorCode) {
    super(code);
    this.code = code;
  }

  code: string;
}
