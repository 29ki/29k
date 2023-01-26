import {
  firebasedynamiclinks,
  type firebasedynamiclinks_v1,
} from '@googleapis/firebasedynamiclinks';
import config from '../lib/config';
import i18next, {LANGUAGE_TAG} from '../lib/i18n';
import type {Exercise} from '../../../shared/src/types/generated/Exercise';

const dynamicLinks = firebasedynamiclinks('v1');

const {
  DEEP_LINK_API_KEY,
  DEEP_LINK_DOMAIN_URI_PREFIX,
  DEEP_LINK_BASE_URL,
  DEEP_LINK_IOS_APPSTORE_ID,
  DEEP_LINK_IOS_BUNDLE_ID,
  DEEP_LINK_IOS_FALLBACK_LINK,
  DEEP_LINK_ANDROID_PACKAGE_NAME,
  DEEP_LINK_ANDROID_FALLBACK_LINK,
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
            // Since app is not live in PlayStore - link to join the closed testing
            androidFallbackLink: DEEP_LINK_ANDROID_FALLBACK_LINK,
            androidPackageName: DEEP_LINK_ANDROID_PACKAGE_NAME,
          },
          iosInfo: {
            // Since app is not live in AppStore - link to join the closed testing
            iosFallbackLink: DEEP_LINK_IOS_FALLBACK_LINK,
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
  contentId: string,
  host: string | undefined,
  language: LANGUAGE_TAG,
) => {
  const {name, description, card, socialMeta} = i18next.t(contentId, {
    lng: language,
    ns: 'exercises',
    returnObjects: true,
  }) as Exercise;

  const t = i18next.getFixedT(language, 'DeepLink.JoinSessionInvite');

  const socialImageLink = socialMeta?.image || card?.image?.source;
  const socialTitle = t('title', {title: socialMeta?.title || name});
  const socialDescription = t('description', {
    host,
    description: socialMeta?.description || description,
  });

  return createDynamicLink(`joinSessionInvite/${inviteCode}`, {
    socialImageLink,
    socialTitle,
    socialDescription,
  });
};

export const createPublicHostCodeLink = (verificationCode: number) =>
  createDynamicLink(`verifyPublicHostCode/${verificationCode}`);
