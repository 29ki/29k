import {
  UserProfileError,
  VerificationError,
} from '../../../../shared/src/errors/User';
import {
  JoinSessionError,
  ValidateSessionError,
} from '../../../../shared/src/errors/Session';

export class RequestError extends Error {
  constructor(
    code:
      | VerificationError
      | JoinSessionError
      | ValidateSessionError
      | UserProfileError,
  ) {
    super(code);
    this.code = code;
  }

  code:
    | VerificationError
    | JoinSessionError
    | ValidateSessionError
    | UserProfileError;
}
