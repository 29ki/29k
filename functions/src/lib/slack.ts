import {WebClient} from '@slack/web-api';
import {SlackError, SlackErrorCode} from '../controllers/errors/SlackError';
import config from './config';
import {RequestAction} from './constants/requestAction';

const {
  SLACK_OAUTH_TOKEN,
  SLACK_BOT_NAME,
  SLACK_PUBLIC_HOST_REQUESTS_CHANNEL,
  SLACK_FEEDBACK_CHANNEL,
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

const createRequestBlocks = (userId: string, email: string) => [
  {
    type: 'divider',
  },
  {
    type: 'header',
    text: {text: 'Public Host Request', type: 'plain_text'},
  },
  {
    type: 'divider',
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Accept ${email} as public host?*`,
    },
  },
  {
    type: 'divider',
  },
  {
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {text: 'Accept', type: 'plain_text'},
        value: userId,
        style: 'primary',
        action_id: RequestAction.ACCEPT_PUBLIC_HOST_ROLE,
      },
      {
        type: 'button',
        text: {text: 'Decline', type: 'plain_text'},
        value: userId,
        style: 'danger',
        action_id: RequestAction.DECLINE_PUBLIC_HOST_ROLE,
      },
    ],
  },
  {
    type: 'divider',
  },
];

const createResponseBlocks = (
  email: string,
  link = '',
  verificationCode?: number,
) => [
  {
    type: 'divider',
  },
  {
    type: 'header',
    text: {text: 'Public Host Request', type: 'plain_text'},
  },
  {
    type: 'divider',
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: verificationCode
        ? `*Accepted <mailto:${email}?body=${encodeURIComponent(
            `${verificationCode} - ${link}`,
          )}|${email}> as public host, please send code \`${verificationCode}\` ${link} to the user.*`
        : `*Declined ${email} as public host*`,
    },
  },
  {
    type: 'divider',
  },
];

const createFeedbackBlocks = (
  exercise = 'unknown',
  image: string | undefined,
  question: string,
  answer: boolean,
  comment: string,
) => [
  {
    type: 'header',
    text: {
      type: 'plain_text',
      text: question,
    },
  },
  {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text:
        `*Answer:* ${answer ? '👍' : '👎'}\n\n` +
        `*Exercise:*\n${exercise}\n\n` +
        `*Comment:*\n${comment}`,
    },
    ...(image && {
      accessory: {
        type: 'image',
        image_url: image,
        alt_text: 'exercise',
      },
    }),
  },
];

export type SlackPayload = {
  message: {ts: string};
  actions: Array<{action_id: string; value: string}>;
  channel: {id: string};
};

export const parseMessage = (slackPayload: SlackPayload) => {
  const channelId = slackPayload.channel.id;
  const ts = slackPayload.message.ts;
  const action_id = slackPayload.actions[0].action_id;
  const userId = slackPayload.actions[0].value;

  return [channelId, ts, action_id, userId];
};

export const sendPublicHostRequestMessage = async (
  userId: string,
  email: string,
) => {
  if (SLACK_PUBLIC_HOST_REQUESTS_CHANNEL) {
    try {
      const slackClient = createSlackClient();

      await slackClient.chat.postMessage({
        blocks: createRequestBlocks(userId, email),
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
      blocks: createResponseBlocks(email, link, verificationCode),
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
) => {
  if (SLACK_FEEDBACK_CHANNEL) {
    try {
      const slackClient = createSlackClient();

      await slackClient.chat.postMessage({
        blocks: createFeedbackBlocks(
          exercise,
          image,
          question,
          answer,
          comment,
        ),
        username: SLACK_BOT_NAME,
        channel: `#${SLACK_FEEDBACK_CHANNEL}`,
      });
    } catch (error) {
      throw new SlackError(SlackErrorCode.couldNotSendMessage, error);
    }
  }
};
