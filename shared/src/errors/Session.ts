export enum ValidateSessionError {
  notFound = 'validateSession/not-found',
  userNotFound = 'validateSession/user-not-found',
  userNotAuthorized = 'validateSession/user-not-authorized',
}

export enum JoinSessionError {
  notAvailable = 'joinSession/not-available',
  notFound = 'joinSession/not-found',
}
