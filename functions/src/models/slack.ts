import {WebClient, KnownBlock} from '@slack/web-api';
import {SlackError, SlackErrorCode} from '../controllers/errors/SlackError';
import config from '../lib/config';
import {SHARING_POST_MIN_LENGTH} from '../lib/constants/post';
import {RequestAction} from '../lib/constants/requestAction';
import {DEFAULT_LANGUAGE_TAG, LANGUAGE_TAG} from '../lib/i18n';
import {translate} from '../lib/translation';

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

const createPublicHostRequestBlocks = (userId: string, email: string) => [
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

const createPublicHostResponseBlocks = (
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

const createPostBlocks = (
  postId: string,
  exercise = 'unknown',
  question = 'unknown',
  originalText: string,
  translatedText: string | undefined,
  language: LANGUAGE_TAG,
) => {
  const text = translatedText
    ? `*${question}*\n` +
      `${translatedText}\n\n` +
      `*[Original Message]*\n` +
      `${originalText}\n\n` +
      `*Langauge:* ${language}\n`
    : `*${question}*\n` + `${originalText}\n\n`;

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: exercise,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text,
      },
    },
  ];

  if (originalText.length >= SHARING_POST_MIN_LENGTH) {
    return [
      ...blocks,
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {text: 'Hide sharing post', type: 'plain_text'},
            value: postId,
            style: 'danger',
            action_id: RequestAction.HIDE_SHARING_POST,
          },
        ],
      },
    ];
  } else {
    return [
      ...blocks,
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: "❌ This post is hidden because it's too short",
        },
      },
    ];
  }
};

const hiddenPostBlock = {
  type: 'section',
  text: {
    type: 'plain_text',
    text: '❌ This post is hidden',
  },
};

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

export const sendPostMessage = async (
  postId: string,
  exercise: string | undefined,
  question: string | undefined,
  originalText: string,
  language: LANGUAGE_TAG,
) => {
  if (SLACK_SHARING_POSTS_CHANNEL) {
    try {
      const slackClient = createSlackClient();

      const translatedText =
        language !== DEFAULT_LANGUAGE_TAG
          ? await translate(originalText, language, DEFAULT_LANGUAGE_TAG)
          : undefined;

      await slackClient.chat.postMessage({
        blocks: createPostBlocks(
          postId,
          exercise,
          question,
          originalText,
          translatedText,
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

export const updatePostMessageAsHidden = async (
  channelId: string,
  ts: string,
  originalBlocks: KnownBlock[],
) => {
  try {
    const slackClient = createSlackClient();

    const blocksWithoutAction = originalBlocks.filter(
      block => block.type !== 'actions',
    );

    await slackClient.chat.update({
      blocks: [...blocksWithoutAction, hiddenPostBlock],
      channel: channelId,
      ts,
    });
  } catch (error) {
    throw new SlackError(SlackErrorCode.couldNotUpdateMessage, error);
  }
};
