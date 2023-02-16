import {SlackError, SlackErrorCode} from '../controllers/errors/SlackError';
import {RequestAction} from '../lib/constants/requestAction';
import {translate} from '../lib/translation';
import {
  parseMessage,
  sendFeedbackMessage,
  sendPostMessage,
  sendPublicHostRequestMessage,
  updatePostMessageAsHidden,
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
jest.mock('../lib/translation');
const mockedTranslate = jest.mocked(translate);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('slack model', () => {
  describe('parseMessage', () => {
    it('should parse valid message', () => {
      expect(
        parseMessage({
          channel: {id: 'some-channel-id'},
          message: {ts: 'some-ts', blocks: []},
          actions: [{action_id: 'some-action-id', value: 'some-user-id'}],
        }),
      ).toEqual({
        channelId: 'some-channel-id',
        ts: 'some-ts',
        actionId: 'some-action-id',
        value: 'some-user-id',
        originalBlocks: [],
      });
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

  describe('sendPostMessage', () => {
    it('should send expected message to slack with translation', async () => {
      mockedTranslate.mockResolvedValueOnce('some translated text');
      await sendPostMessage(
        'some-post-id',
        'some exercise',
        'some question',
        'some text that is longer than 20 chars',
        'sv',
      );

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenLastCalledWith({
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'some exercise',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                `*some question*\n` +
                `some translated text\n\n` +
                `*[Original Message]*\n` +
                `some text that is longer than 20 chars\n\n` +
                `*Langauge:* sv\n`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {text: 'Hide sharing post', type: 'plain_text'},
                value: 'some-post-id',
                style: 'danger',
                action_id: RequestAction.HIDE_SHARING_POST,
              },
            ],
          },
        ],
        channel: '#some-channel',
        username: 'Some Bot',
      });
    });

    it('should send expected message to slack without translation', async () => {
      await sendPostMessage(
        'some-post-id',
        'some exercise',
        'some question',
        'some text that is longer than 20 chars',
        'en',
      );

      expect(mockedTranslate).toHaveBeenCalledTimes(0);
      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenLastCalledWith({
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'some exercise',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                `*some question*\n` +
                `some text that is longer than 20 chars\n\n`,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {text: 'Hide sharing post', type: 'plain_text'},
                value: 'some-post-id',
                style: 'danger',
                action_id: RequestAction.HIDE_SHARING_POST,
              },
            ],
          },
        ],
        channel: '#some-channel',
        username: 'Some Bot',
      });
    });

    it('should send expected message to slack with short message', async () => {
      mockedTranslate.mockResolvedValueOnce('some translated text');
      await sendPostMessage(
        'some-post-id',
        'some exercise',
        'some question',
        'some text',
        'sv',
      );

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenLastCalledWith({
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: 'some exercise',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                `*some question*\n` +
                `some translated text\n\n` +
                `*[Original Message]*\n` +
                `some text\n\n` +
                `*Langauge:* sv\n`,
            },
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: "❌ This post is hidden because it's too short",
            },
          },
        ],
        channel: '#some-channel',
        username: 'Some Bot',
      });
    });
  });

  describe('updatePostMessageAsHidden', () => {
    it('should update message as expected', async () => {
      updatePostMessageAsHidden('some-channel-id', 'some-ts', [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'some text',
          },
        },
        {type: 'actions', elements: []},
      ]);

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'some text',
            },
          },
          {
            type: 'section',
            text: {
              type: 'plain_text',
              text: '❌ This post is hidden',
            },
          },
        ],
        channel: 'some-channel-id',
        ts: 'some-ts',
      });
    });
  });
});
