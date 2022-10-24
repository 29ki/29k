import {verifySlackRequest as verify} from '@slack/bolt';
import verifySlackRequest, {SlackAuthContext} from './verifySlackRequest';

const mockVerifySlackRequest = verify as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});

describe('verifySlackRequests', () => {
  it('passes middleware if requests is valid', async () => {
    const middleware = verifySlackRequest();

    const ctx = {
      headers: {
        'x-slack-signature': 'some-signature',
        'x-slack-request-timestamp': 'some-timestamp',
      },
      req: {rawBody: Buffer.from('')},
    } as unknown as SlackAuthContext;
    const next = jest.fn();

    await middleware(ctx, next);

    expect(mockVerifySlackRequest).toHaveBeenCalledTimes(1);
    expect(mockVerifySlackRequest).toHaveBeenCalledWith({
      signingSecret: 'some-slack-signing-secret',
      headers: ctx.headers,
      body: '',
    });

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('does not pass middleware if requests is invalid', async () => {
    mockVerifySlackRequest.mockImplementation(() => {
      throw new Error('Error');
    });
    const middleware = verifySlackRequest();

    const ctx = {
      headers: {
        'x-slack-signature': 'some-signature',
        'x-slack-request-timestamp': 'some-timestamp',
      },
      req: {rawBody: Buffer.from('')},
    } as unknown as SlackAuthContext;
    const next = jest.fn();

    try {
      await middleware(ctx, next);
    } catch (error) {
      expect(error).toEqual(new Error('Error'));
    }

    expect(mockVerifySlackRequest).toHaveBeenCalledTimes(1);
    expect(mockVerifySlackRequest).toHaveBeenCalledWith({
      signingSecret: 'some-slack-signing-secret',
      headers: ctx.headers,
      body: '',
    });

    expect(next).toHaveBeenCalledTimes(0);
  });
});
