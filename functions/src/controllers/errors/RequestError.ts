import {VerificationError} from '../../../../shared/src/errors/User';

export class RequestError extends Error {
  constructor(code: VerificationError) {
    super(code);
    this.code = code;
  }

  code: VerificationError;
}
