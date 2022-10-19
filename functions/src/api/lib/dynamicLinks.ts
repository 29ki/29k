import {
  firebasedynamiclinks,
  type firebasedynamiclinks_v1,
} from '@googleapis/firebasedynamiclinks';
import config from '../../lib/config';

const dynamicLinks = firebasedynamiclinks('v1');

const {
  DEEP_LINK_API_KEY,
  DEEP_LINK_DOMAIN_URI_PREFIX,
  DEEP_LINK_BASE_URL,
  DEEP_LINK_ANDROID_PACKAGE_NAME,
  DEEP_LINK_IOS_BUNDLE_ID,
  DEEP_LINK_IOS_APPSTORE_ID,
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
            enableForcedRedirect: true,
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
