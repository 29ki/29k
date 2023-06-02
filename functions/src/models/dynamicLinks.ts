import {
  firebasedynamiclinks,
  type firebasedynamiclinks_v1,
} from '@googleapis/firebasedynamiclinks';
import config from '../lib/config';
import i18next, {LANGUAGE_TAG} from '../lib/i18n';
import {getExerciseById} from '../lib/exercise';

const dynamicLinks = firebasedynamiclinks('v1');

const {
  DEEP_LINK_API_KEY,
  DEEP_LINK_DOMAIN_URI_PREFIX,
  DEEP_LINK_BASE_URL,
  DEEP_LINK_IOS_APPSTORE_ID,
  DEEP_LINK_IOS_BUNDLE_ID,
  DEEP_LINK_ANDROID_PACKAGE_NAME,
} = config;

export const createDynamicLink = async (
  path: string,
  socialMetaTagInfo?: firebasedynamiclinks_v1.Schema$SocialMetaTagInfo,
) => {
  const link = new URL(path, DEEP_LINK_BASE_URL).toString();

  try {
    const result = await dynamicLinks.shortLinks.create({
      key: DEEP_LINK_API_KEY,
      requestBody: {
        dynamicLinkInfo: {
          domainUriPrefix: DEEP_LINK_DOMAIN_URI_PREFIX,
          link,
          androidInfo: {
            androidPackageName: DEEP_LINK_ANDROID_PACKAGE_NAME,
          },
          iosInfo: {
            iosBundleId: DEEP_LINK_IOS_BUNDLE_ID,
            iosAppStoreId: DEEP_LINK_IOS_APPSTORE_ID,
          },
          navigationInfo: {
            enableForcedRedirect: false,
          },
          socialMetaTagInfo,
        },
      },
    });

    return result.data.shortLink ?? undefined;
  } catch (cause) {
    throw new Error('Failed creating dynamic link', {cause});
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

  const socialImageLink = socialMeta?.image || card?.image?.source;
  const socialTitle = t('title', {title: socialMeta?.title || name});
  const socialDescription = t('description', {
    host,
    description: socialMeta?.description || description,
    inviteCode,
    interpolation: {escapeValue: false},
  });

  return createDynamicLink(`joinSessionInvite/${inviteCode}`, {
    socialImageLink,
    socialTitle,
    socialDescription,
  });
};

export const createPublicHostCodeLink = (verificationCode: number) =>
  createDynamicLink(`verifyPublicHostCode/${verificationCode}`);

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

  const {name, description, card, socialMeta} = exercise;

  const t = i18next.getFixedT(language, 'DeepLink.HostSessionInvite');

  const socialImageLink = socialMeta?.image || card?.image?.source;
  const socialTitle = t('title', {title: socialMeta?.title || name});
  const socialDescription = t('description', {
    host,
    description: socialMeta?.description || description,
    hostingCode,
    interpolation: {escapeValue: false},
  });

  return createDynamicLink(`hostSessionInvite/${hostingCode}`, {
    socialImageLink,
    socialTitle,
    socialDescription,
  });
};
