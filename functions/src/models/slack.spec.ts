import {SlackError, SlackErrorCode} from '../controllers/errors/SlackError';
import {RequestAction} from '../lib/constants/requestAction';
import {
  parseMessage,
  sendFeedbackMessage,
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

describe('slack model', () => {
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

    it('should rethrow error', async () => {
      mockPostMessage.mockRejectedValueOnce('error cause');

      try {
        await sendPublicHostRequestMessage('some-user-id', 'some@email.com');
      } catch (error) {
        expect(error).toEqual(
          new SlackError(SlackErrorCode.couldNotSendMessage, 'error cause'),
        );
      }
    });
  });

  describe('updatePublicHostRequestMessage', () => {
    it('should update message to accepted status when user is accepted', async () => {
      await updatePublicHostRequestMessage(
        'some-channel-id',
        'some-ts',
        'some@email.com',
        'http://some.deep/verification/link',
        123456,
      );

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        blocks: expect.arrayContaining([
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Accepted <mailto:some@email.com?body=123456%20-%20http%3A%2F%2Fsome.deep%2Fverification%2Flink|some@email.com> as public host, please send code `123456` http://some.deep/verification/link to the user.*',
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

    it('should rethrow error', async () => {
      mockUpdate.mockRejectedValueOnce('error cause');

      try {
        await updatePublicHostRequestMessage(
          'some-channel-id',
          'some-ts',
          'some@email.com',
        );
      } catch (error) {
        expect(error).toEqual(
          new SlackError(SlackErrorCode.couldNotUpdateMessage, 'error cause'),
        );
      }
    });
  });

  describe('sendFeedbackMessage', () => {
    it('should send expected message to slack', async () => {
      await sendFeedbackMessage(
        'Some Exercise Name',
        'https://some.image/url',
        'Some question?',
        true,
        'Some comment!',
      );

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith({
        blocks: [
          {text: {text: 'Some question?', type: 'plain_text'}, type: 'header'},
          {
            accessory: {
              alt_text: 'exercise',
              image_url: 'https://some.image/url',
              type: 'image',
            },
            text: {
              text: '*Answer:* 👍\n\n*Exercise:*\nSome Exercise Name\n\n*Comment:*\nSome comment!',
              type: 'mrkdwn',
            },
            type: 'section',
          },
        ],
        channel: '#some-channel',
        username: 'Some Bot',
      });
    });

    it("doesn't require an exercise or image", async () => {
      await sendFeedbackMessage(
        undefined,
        undefined,
        'Some question?',
        true,
        'Some comment!',
      );

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith({
        blocks: [
          {text: {text: 'Some question?', type: 'plain_text'}, type: 'header'},
          {
            text: {
              text: '*Answer:* 👍\n\n*Exercise:*\nunknown\n\n*Comment:*\nSome comment!',
              type: 'mrkdwn',
            },
            type: 'section',
          },
        ],
        channel: '#some-channel',
        username: 'Some Bot',
      });
    });
  });
});
