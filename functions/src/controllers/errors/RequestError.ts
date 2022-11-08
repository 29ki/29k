import {VerificationError} from '../../../../shared/src/errors/User';
import {JoinSessionError} from '../../../../shared/src/errors/Session';

export class RequestError extends Error {
  constructor(code: VerificationError | JoinSessionError) {
    super(code);
    this.code = code;
  }

  code: VerificationError | JoinSessionError;
}
