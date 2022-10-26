export enum SlackErrorCode {
  userNotFound = 'slack/user-not-found',
  couldNotParseMessage = 'slack/could-not-parse-message',
  couldNotSendMessage = 'slack/could-not-send-message',
  couldNotUpdateMessage = 'slack/could-not-update-message',
}

export class SlackError extends Error {
  constructor(code: SlackErrorCode, cause?: unknown) {
    super(code, {cause});
    this.code = code;
  }

  code: string;
}
