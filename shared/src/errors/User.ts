export enum VerificationError {
  userNeedEmail = 'verificatin/user-needs-email',
  requestExists = 'verification/request-exists',
  requestNotFound = 'verification/request-not-found',
  requestDeclined = 'verification/request-declined',
  verificationAlreadyCalimed = 'verification/already-claimed',
  verificationFailed = 'verification/failed',
}

export enum UserProfileError {
  userNotFound = 'userProfile/user-not-found',
}
