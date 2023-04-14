import {UserError, VerificationError} from '../../../../shared/src/errors/User';
import {
  JoinSessionError,
  ValidateSessionError,
} from '../../../../shared/src/errors/Session';
import {PostError} from '../../../../shared/src/errors/Post';

export class RequestError extends Error {
  constructor(
    code:
      | VerificationError
      | JoinSessionError
      | ValidateSessionError
      | UserError
      | PostError,
  ) {
    super(code);
    this.code = code;
  }

  code:
    | VerificationError
    | JoinSessionError
    | ValidateSessionError
    | UserError
    | PostError;
}
