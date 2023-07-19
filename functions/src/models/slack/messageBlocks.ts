import {KnownBlock, ActionsBlock} from '@slack/web-api';
import {SessionMode, SessionType} from '../../../../shared/src/schemas/Session';
import {SHARING_POST_MIN_LENGTH} from '../../lib/constants/post';
import {RequestAction} from '../../lib/constants/requestAction';
import {LANGUAGE_TAG} from '../../lib/i18n';

export const createPublicHostRequestBlocks = (
  userId: string,
  email: string,
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
export const createPublicHostResponseBlocks = (
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
export const createVisibilityActionBlock = (postId: string, visible: boolean) =>
  ({
    type: 'actions',
    elements: [
      {
        type: 'button',
        text: {
          text: visible ? 'Hide sharing post' : 'Show sharing post',
          type: 'plain_text',
        },
        value: postId,
        style: visible ? undefined : 'danger',
        action_id: visible
          ? RequestAction.HIDE_SHARING_POST
          : RequestAction.SHOW_SHARING_POST,
        confirm: {
          style: 'danger',
          text: {
            text: 'Are you sure?',
            type: 'plain_text',
          },
          confirm: {
            text: 'Yes',
            type: 'plain_text',
          },
          deny: {
            text: 'No',
            type: 'plain_text',
          },
        },
      },
    ],
  }) as ActionsBlock;

export const createPostBlocks = (
  approved: boolean,
  postId: string,
  image: string | undefined,
  exercise = 'unknown',
  question = 'unknown',
  originalText: string,
  translatedText: string | undefined,
  classifications: string[] | undefined,
  language: LANGUAGE_TAG,
) => {
  const text = translatedText
    ? `*${question}*\n` +
      `${translatedText}\n\n` +
      `*[Original Message]*\n` +
      `${originalText}\n\n` +
      `*Langauge:* ${language}\n`
    : `*${question}*\n` + `${originalText}\n\n`;

  let blocks: KnownBlock[] = [
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
      ...(image && {
        accessory: {
          type: 'image',
          image_url: image,
          alt_text: 'exercise',
        },
      }),
    },
  ];

  if (classifications?.length && classifications[0] !== 'none') {
    blocks.push({
      type: 'section',
      text: {
        type: 'plain_text',
        text: `⚠️ ${classifications.join(', ')}`,
      },
    });
  }

  if (originalText.length >= SHARING_POST_MIN_LENGTH) {
    blocks.push(createVisibilityActionBlock(postId, approved));
  } else {
    blocks.push({
      type: 'section',
      text: {
        type: 'plain_text',
        text: "❌ This post is hidden because it's too short",
      },
    });
  }

  return blocks;
};
export const createFeedbackBlocks = (
  exercise = 'unknown',
  image: string | undefined,
  question: string,
  answer: boolean,
  comment: string,
  sessionType: SessionType | undefined,
  sessionMode: SessionMode | undefined,
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
        `*Exercise:*\n${exercise} (${sessionMode ? sessionMode : ''} - ${
          sessionType ? sessionType : ''
        })\n\n` +
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
