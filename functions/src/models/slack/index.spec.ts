import {SessionMode, SessionType} from '../../../../shared/src/schemas/Session';
import {SlackError, SlackErrorCode} from '../../controllers/errors/SlackError';
import {RequestAction} from '../../lib/constants/requestAction';
import {
  parseMessage,
  sendFeedbackMessage,
  sendPostMessage,
  sendPublicHostRequestMessage,
  updatePostMessageVisibility,
  updatePublicHostRequestMessage,
} from '.';

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
        blocks: [
          {type: 'divider'},
          {
            text: {text: 'Public Host Request', type: 'plain_text'},
            type: 'header',
          },
          {type: 'divider'},
          {
            text: {
              text: '*Accept some@email.com as public host?*',
              type: 'mrkdwn',
            },
            type: 'section',
          },
          {type: 'divider'},
          {
            elements: [
              {
                action_id: 'acceptPublicHostRole',
                style: 'primary',
                text: {text: 'Accept', type: 'plain_text'},
                type: 'button',
                value: 'some-user-id',
              },
              {
                action_id: 'declinePublicHostRole',
                style: 'danger',
                text: {text: 'Decline', type: 'plain_text'},
                type: 'button',
                value: 'some-user-id',
              },
            ],
            type: 'actions',
          },
          {type: 'divider'},
        ],
        channel: '#some-channel',
        text: 'some@email.com wants to become a public host',
        username: 'Some Bot',
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
        SessionType.public,
        SessionMode.live,
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
              text: '*Answer:* 👍\n\n*Exercise:*\nSome Exercise Name (live - public)\n\n*Comment:*\nSome comment!',
              type: 'mrkdwn',
            },
            type: 'section',
          },
        ],
        channel: '#some-channel',
        text: 'Some question?: 👍 Some comment!',
        username: 'Some Bot',
      });
    });

    it("doesn't require, exercise, image, session mode or session type", async () => {
      await sendFeedbackMessage(
        undefined,
        undefined,
        'Some question?',
        true,
        'Some comment!',
        undefined,
        undefined,
      );

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenCalledWith({
        blocks: [
          {text: {text: 'Some question?', type: 'plain_text'}, type: 'header'},
          {
            text: {
              text: '*Answer:* 👍\n\n*Exercise:*\nunknown ( - )\n\n*Comment:*\nSome comment!',
              type: 'mrkdwn',
            },
            type: 'section',
          },
        ],
        text: 'Some question?: 👍 Some comment!',
        channel: '#some-channel',
        username: 'Some Bot',
      });
    });
  });

  describe('sendPostMessage', () => {
    it('should send expected message to slack with translation', async () => {
      await sendPostMessage(
        'some-post-id',
        true,
        'some-image-url',
        'some exercise',
        'some question',
        'some text that is longer than 20 chars',
        'some translated text',
        undefined,
        'sv',
      );

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenLastCalledWith({
        blocks: [
          {text: {text: 'some exercise', type: 'plain_text'}, type: 'header'},
          {
            accessory: {
              alt_text: 'exercise',
              image_url: 'some-image-url',
              type: 'image',
            },
            text: {
              text:
                `*some question*\n` +
                `some translated text\n\n` +
                `*[Original Message]*\n` +
                `some text that is longer than 20 chars\n\n` +
                `*Langauge:* sv\n`,
              type: 'mrkdwn',
            },
            type: 'section',
          },
          {
            elements: [
              {
                action_id: RequestAction.HIDE_SHARING_POST,
                confirm: {
                  confirm: {text: 'Yes', type: 'plain_text'},
                  deny: {text: 'No', type: 'plain_text'},
                  style: 'danger',
                  text: {text: 'Are you sure?', type: 'plain_text'},
                },
                style: undefined,
                text: {text: 'Hide sharing post', type: 'plain_text'},
                type: 'button',
                value: 'some-post-id',
              },
            ],
            type: 'actions',
          },
        ],
        channel: '#some-channel',
        text: 'some question: some text that is longer than 20 chars',
        username: 'Some Bot',
      });
    });

    it('should send expected message to slack without translation', async () => {
      await sendPostMessage(
        'some-post-id',
        true,
        'some-image-url',
        'some exercise',
        'some question',
        'some text that is longer than 20 chars',
        undefined,
        undefined,
        'en',
      );

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenLastCalledWith({
        blocks: [
          {text: {text: 'some exercise', type: 'plain_text'}, type: 'header'},
          {
            accessory: {
              alt_text: 'exercise',
              image_url: 'some-image-url',
              type: 'image',
            },
            text: {
              text:
                `*some question*\n` +
                `some text that is longer than 20 chars\n\n`,
              type: 'mrkdwn',
            },
            type: 'section',
          },
          {
            elements: [
              {
                action_id: RequestAction.HIDE_SHARING_POST,
                confirm: {
                  confirm: {text: 'Yes', type: 'plain_text'},
                  deny: {text: 'No', type: 'plain_text'},
                  style: 'danger',
                  text: {text: 'Are you sure?', type: 'plain_text'},
                },
                style: undefined,
                text: {text: 'Hide sharing post', type: 'plain_text'},
                type: 'button',
                value: 'some-post-id',
              },
            ],
            type: 'actions',
          },
        ],
        channel: '#some-channel',
        text: 'some question: some text that is longer than 20 chars',
        username: 'Some Bot',
      });
    });

    it('should send expected message to slack for classified posts', async () => {
      await sendPostMessage(
        'some-post-id',
        true,
        'some-image-url',
        'some exercise',
        'some question',
        'some text that is longer than 20 chars',
        undefined,
        ['Some classification', 'Some other classification'],
        'en',
      );

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenLastCalledWith({
        blocks: [
          {text: {text: 'some exercise', type: 'plain_text'}, type: 'header'},
          {
            accessory: {
              alt_text: 'exercise',
              image_url: 'some-image-url',
              type: 'image',
            },
            text: {
              text:
                `*some question*\n` +
                `some text that is longer than 20 chars\n\n`,
              type: 'mrkdwn',
            },
            type: 'section',
          },
          {
            text: {
              text: '⚠️ Some classification, Some other classification',
              type: 'plain_text',
            },
            type: 'section',
          },
          {
            elements: [
              {
                action_id: RequestAction.HIDE_SHARING_POST,
                confirm: {
                  confirm: {text: 'Yes', type: 'plain_text'},
                  deny: {text: 'No', type: 'plain_text'},
                  style: 'danger',
                  text: {text: 'Are you sure?', type: 'plain_text'},
                },
                style: undefined,
                text: {text: 'Hide sharing post', type: 'plain_text'},
                type: 'button',
                value: 'some-post-id',
              },
            ],
            type: 'actions',
          },
        ],
        channel: '#some-channel',
        text: 'some question: some text that is longer than 20 chars',
        username: 'Some Bot',
      });
    });

    it('should send expected message to slack for non approved posts', async () => {
      await sendPostMessage(
        'some-post-id',
        false,
        'some-image-url',
        'some exercise',
        'some question',
        'some text that is longer than 20 chars',
        undefined,
        undefined,
        'en',
      );

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenLastCalledWith({
        blocks: [
          {text: {text: 'some exercise', type: 'plain_text'}, type: 'header'},
          {
            accessory: {
              alt_text: 'exercise',
              image_url: 'some-image-url',
              type: 'image',
            },
            text: {
              text:
                `*some question*\n` +
                `some text that is longer than 20 chars\n\n`,
              type: 'mrkdwn',
            },
            type: 'section',
          },
          {
            elements: [
              {
                action_id: RequestAction.SHOW_SHARING_POST,
                confirm: {
                  confirm: {text: 'Yes', type: 'plain_text'},
                  deny: {text: 'No', type: 'plain_text'},
                  style: 'danger',
                  text: {text: 'Are you sure?', type: 'plain_text'},
                },
                style: 'danger',
                text: {text: 'Show sharing post', type: 'plain_text'},
                type: 'button',
                value: 'some-post-id',
              },
            ],
            type: 'actions',
          },
        ],
        channel: '#some-channel',
        text: 'some question: some text that is longer than 20 chars',
        username: 'Some Bot',
      });
    });

    it('should send expected message to slack with short message', async () => {
      await sendPostMessage(
        'some-post-id',
        true,
        'some-image-url',
        'some exercise',
        'some question',
        'some text',
        undefined,
        undefined,
        'en',
      );

      expect(mockPostMessage).toHaveBeenCalledTimes(1);
      expect(mockPostMessage).toHaveBeenLastCalledWith({
        blocks: [
          {text: {text: 'some exercise', type: 'plain_text'}, type: 'header'},
          {
            accessory: {
              alt_text: 'exercise',
              image_url: 'some-image-url',
              type: 'image',
            },
            text: {
              text: `*some question*\n` + `some text\n\n`,
              type: 'mrkdwn',
            },
            type: 'section',
          },
          {
            text: {
              text: "❌ This post is hidden because it's too short",
              type: 'plain_text',
            },
            type: 'section',
          },
        ],
        channel: '#some-channel',
        text: 'some question: some text',
        username: 'Some Bot',
      });
    });
  });

  describe('updatePostMessageVisibility', () => {
    it('should update message as hidden', async () => {
      updatePostMessageVisibility(
        'some-channel-id',
        'some-ts',
        'some-post-id',
        [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'some text',
            },
          },
          {type: 'actions', elements: []},
        ],
        false,
      );

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        blocks: [
          {text: {text: 'some text', type: 'mrkdwn'}, type: 'section'},
          {
            elements: [
              {
                action_id: RequestAction.SHOW_SHARING_POST,
                confirm: {
                  confirm: {text: 'Yes', type: 'plain_text'},
                  deny: {text: 'No', type: 'plain_text'},
                  style: 'danger',
                  text: {text: 'Are you sure?', type: 'plain_text'},
                },
                style: 'danger',
                text: {text: 'Show sharing post', type: 'plain_text'},
                type: 'button',
                value: 'some-post-id',
              },
            ],
            type: 'actions',
          },
        ],
        channel: 'some-channel-id',
        ts: 'some-ts',
      });
    });

    it('should update message as visible', async () => {
      updatePostMessageVisibility(
        'some-channel-id',
        'some-ts',
        'some-post-id',
        [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'some text',
            },
          },
          {type: 'actions', elements: []},
        ],
        true,
      );

      expect(mockUpdate).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        blocks: [
          {text: {text: 'some text', type: 'mrkdwn'}, type: 'section'},
          {
            elements: [
              {
                action_id: RequestAction.HIDE_SHARING_POST,
                confirm: {
                  confirm: {text: 'Yes', type: 'plain_text'},
                  deny: {text: 'No', type: 'plain_text'},
                  style: 'danger',
                  text: {text: 'Are you sure?', type: 'plain_text'},
                },
                style: undefined,
                text: {text: 'Hide sharing post', type: 'plain_text'},
                type: 'button',
                value: 'some-post-id',
              },
            ],
            type: 'actions',
          },
        ],
        channel: 'some-channel-id',
        ts: 'some-ts',
      });
    });
  });
});
