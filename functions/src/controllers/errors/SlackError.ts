type HandleSlackError = 'user-not-found' | 'could-not-parse-message';

export class SlackError extends Error {
  constructor(code: HandleSlackError, cause?: unknown) {
    super(code, {cause});
    this.code = code;
  }

  code: string;
}
