import {WebClient, KnownBlock} from '@slack/web-api';
import {SessionMode, SessionType} from '../../../../shared/src/schemas/Session';
import {SlackError, SlackErrorCode} from '../../controllers/errors/SlackError';
import config from '../../lib/config';
import {LANGUAGE_TAG} from '../../lib/i18n';
import {
  createPublicHostRequestBlocks,
  createPublicHostResponseBlocks,
  createFeedbackBlocks,
  createPostBlocks,
  createVisibilityActionBlock,
} from './messageBlocks';

const {
  SLACK_OAUTH_TOKEN,
  SLACK_BOT_NAME,
  SLACK_PUBLIC_HOST_REQUESTS_CHANNEL,
  SLACK_FEEDBACK_CHANNEL,
  SLACK_SHARING_POSTS_CHANNEL,
} = config;

const createSlackClient = () => {
  if (SLACK_BOT_NAME && SLACK_OAUTH_TOKEN) {
    return new WebClient(SLACK_OAUTH_TOKEN);
  }

  return {
    chat: {
      postMessage: async () => console.log('Request sent to slack'),
      update: async () => console.log('Request updated'),
    },
  };
};

export type SlackPayload = {
  message: {ts: string; blocks: KnownBlock[]};
  actions: Array<{action_id: string; value: string}>;
  channel: {id: string};
};

export const parseMessage = (slackPayload: SlackPayload) => {
  const channelId = slackPayload.channel.id;
  const ts = slackPayload.message.ts;
  const originalBlocks = slackPayload.message.blocks;
  const actionId = slackPayload.actions[0].action_id;
  const value = slackPayload.actions[0].value;

  return {channelId, ts, actionId, value, originalBlocks};
};

export const sendPublicHostRequestMessage = async (
  userId: string,
  email: string,
) => {
  if (SLACK_PUBLIC_HOST_REQUESTS_CHANNEL) {
    try {
      const slackClient = createSlackClient();

      await slackClient.chat.postMessage({
        text: `${email} wants to become a public host`,
        blocks: createPublicHostRequestBlocks(userId, email),
        username: SLACK_BOT_NAME,
        channel: `#${SLACK_PUBLIC_HOST_REQUESTS_CHANNEL}`,
      });
    } catch (error) {
      throw new SlackError(SlackErrorCode.couldNotSendMessage, error);
    }
  }
};

export const updatePublicHostRequestMessage = async (
  channelId: string,
  ts: string,
  email: string,
  link?: string,
  verificationCode?: number,
) => {
  try {
    const slackClient = createSlackClient();

    await slackClient.chat.update({
      blocks: createPublicHostResponseBlocks(email, link, verificationCode),
      channel: channelId,
      ts,
    });
  } catch (error) {
    throw new SlackError(SlackErrorCode.couldNotUpdateMessage, error);
  }
};

export const sendFeedbackMessage = async (
  exercise: string | undefined,
  image: string | undefined,
  question: string,
  answer: boolean,
  comment: string,
  sessionType: SessionType | undefined,
  sessionMode: SessionMode | undefined,
) => {
  if (SLACK_FEEDBACK_CHANNEL) {
    try {
      const slackClient = createSlackClient();

      await slackClient.chat.postMessage({
        text: `${question}: ${answer ? '👍' : '👎'} ${comment}`,
        blocks: createFeedbackBlocks(
          exercise,
          image,
          question,
          answer,
          comment,
          sessionType,
          sessionMode,
        ),
        username: SLACK_BOT_NAME,
        channel: `#${SLACK_FEEDBACK_CHANNEL}`,
      });
    } catch (error) {
      throw new SlackError(SlackErrorCode.couldNotSendMessage, error);
    }
  }
};

export const sendPostMessage = async (
  postId: string,
  approved: boolean,
  image: string | undefined,
  exercise: string | undefined,
  question: string | undefined,
  originalText: string,
  translatedText: string | undefined,
  classifications: string[] | undefined | null,
  language: LANGUAGE_TAG,
) => {
  if (SLACK_SHARING_POSTS_CHANNEL) {
    try {
      const slackClient = createSlackClient();

      await slackClient.chat.postMessage({
        text: `${question}: ${originalText}`,
        blocks: createPostBlocks(
          approved,
          postId,
          image,
          exercise,
          question,
          originalText,
          translatedText,
          classifications,
          language,
        ),
        username: SLACK_BOT_NAME,
        channel: `#${SLACK_SHARING_POSTS_CHANNEL}`,
      });
    } catch (error) {
      throw new SlackError(SlackErrorCode.couldNotSendMessage, error);
    }
  }
};

export const updatePostMessageVisibility = async (
  channelId: string,
  ts: string,
  postId: string,
  originalBlocks: KnownBlock[],
  visible: boolean,
) => {
  try {
    const slackClient = createSlackClient();

    const blocksWithoutAction = originalBlocks.filter(
      block => block.type !== 'actions',
    );

    await slackClient.chat.update({
      blocks: [
        ...blocksWithoutAction,
        createVisibilityActionBlock(postId, visible),
      ],
      channel: channelId,
      ts,
    });
  } catch (error) {
    throw new SlackError(SlackErrorCode.couldNotUpdateMessage, error);
  }
};
