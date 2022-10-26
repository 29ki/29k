import {RequestAction} from './constants/requestAction';
import {
  parseMessage,
  sendPublicHostRequestMessage,
  updatePublicHostRequestMessage,
} from './slack';

const mockPostMessage = jest.fn();
const mockUpdate = jest.fn();
jest.mock('@slack/web-api', () => ({
  WebClient: jest.fn().mockImplementation(() => ({
    chat: {
      postMessage: mockPostMessage,
      update: mockUpdate,
    },
  })),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('slack', () => {
  describe('parseMessage', () => {
    it('should parse valid message', () => {
      expect(
        parseMessage({
          channel: {id: 'some-channel-id'},
          message: {ts: 'some-ts'},
          actions: [{action_id: 'some-action-id', value: 'some-user-id'}],
        }),
      ).toEqual([
        'some-channel-id',
        'some-ts',
        'some-action-id',
        'some-user-id',
      ]);
    });
  });

  describe('sendPublicHostRequestMessage', () => {
    it('should send expected message to slack', async () => {
      await sendPublicHostRequestMessage('some-user-id', 'some@email.com');

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith({
        blocks: expect.arrayContaining([
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Accept some@email.com as public host?*`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {text: 'Accept', type: 'plain_text'},
                value: 'some-user-id',
                style: 'primary',
                action_id: RequestAction.ACCEPT_PUBLIC_HOST_ROLE,
              },
              {
                type: 'button',
                text: {text: 'Decline', type: 'plain_text'},
                value: 'some-user-id',
                style: 'danger',
                action_id: RequestAction.DECLINE_PUBLIC_HOST_ROLE,
              },
            ],
          },
        ]),
        username: 'Some Bot',
        channel: '#some-channel',
      });
    });
  });

  describe('updatePublicHostRequestMessage', () => {
    it('should update message to accepted status when user is accepted', async () => {
      await updatePublicHostRequestMessage(
        'some-channel-id',
        'some-ts',
        'some@email.com',
        123456,
      );

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        blocks: expect.arrayContaining([
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Accepted <mailto:some@email.com?body=123456|some@email.com> as public host, please send code `123456` to the user.*',
            },
          },
        ]),
        channel: 'some-channel-id',
        ts: 'some-ts',
      });
    });

    it('should update message to declined status when user is declined', async () => {
      await updatePublicHostRequestMessage(
        'some-channel-id',
        'some-ts',
        'some@email.com',
      );

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        blocks: expect.arrayContaining([
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Declined some@email.com as public host*',
            },
          },
        ]),
        channel: 'some-channel-id',
        ts: 'some-ts',
      });
    });
  });
});
