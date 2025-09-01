import config from '../lib/config';
import i18next, {LANGUAGE_TAG} from '../lib/i18n';
import {getExerciseById} from '../lib/exercise';

const {AIRBRIDGE_API_TOKEN, DEEP_LINK_SCHEME} = config;

type LinkOgTag = {
  title?: string;
  description?: string;
  imageUrl?: string;
};

type LinkResponse = {
  data: {
    trackingLink: {
      id: number;
      link: {
        click: string;
        impression: string;
        serverToServerClick: string | null;
      };
      shortId: string;
      shortUrl: string;
      channelType: string;
      trackingTemplateId: string;
    };
  };
};

export const createTrackingLink = async (path: string, ogTag?: LinkOgTag) => {
  try {
    const response = await fetch('https://api.airbridge.io/v1/tracking-links', {
      method: 'POST',
      headers: {
        'Accept-Language': 'en',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AIRBRIDGE_API_TOKEN}`,
      },
      body: JSON.stringify({
        deeplinkUrl: `${DEEP_LINK_SCHEME}://${path}`,
        channel: 'app',
        deeplinkOption: {
          showAlertForInitialDeeplinkingIssue: true,
        },
        fallbackPaths: {
          android: 'google-play',
          ios: 'itunes-appstore',
        },
        ogTag,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = (await response.json()) as LinkResponse;

    return result.data.trackingLink.shortUrl;
  } catch (cause) {
    throw new Error('Failed creating tracking link', {cause});
  }
};

export const createSessionInviteLink = async (
  inviteCode: number,
  exerciseId: string,
  host: string | undefined,
  language: LANGUAGE_TAG,
) => {
  const exercise = getExerciseById(exerciseId, language);

  if (!exercise) {
    return;
  }

  const {name, description, card, socialMeta} = exercise;

  const t = i18next.getFixedT(language, 'DeepLink.JoinSessionInvite');

  const ogImageUrl = socialMeta?.image || card?.image?.source;
  const ogTitle = t('title', {title: socialMeta?.title || name});
  const ogDescription = t('description', {
    host,
    description: socialMeta?.description || description,
    inviteCode,
    interpolation: {escapeValue: false},
  });

  return createTrackingLink(`joinSessionInvite/${inviteCode}`, {
    imageUrl: ogImageUrl,
    title: ogTitle,
    description: ogDescription,
  });
};

export const createPublicHostCodeLink = (verificationCode: number) =>
  createTrackingLink(`verifyPublicHostCode/${verificationCode}`);

export const createSessionHostTransferLink = async (
  hostingCode: number,
  exerciseId: string,
  host: string | undefined,
  language: LANGUAGE_TAG,
) => {
  const exercise = getExerciseById(exerciseId, language);

  if (!exercise) {
    return;
  }

  const {name, card, socialMeta} = exercise;

  const t = i18next.getFixedT(language, 'DeepLink.HostSessionInvite');

  const ogImageUrl = socialMeta?.image || card?.image?.source;
  const ogTitle = t('title', {hostName: host, sessionName: name});
  const ogDescription = t('description');

  return createTrackingLink(`hostSessionInvite/${hostingCode}`, {
    imageUrl: ogImageUrl,
    title: ogTitle,
    description: ogDescription,
  });
};
