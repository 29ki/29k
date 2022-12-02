import {firebasedynamiclinks} from '@googleapis/firebasedynamiclinks';
import {
  createDynamicLink,
  createPublicHostCodeLink,
  createSessionInviteLink,
} from './dynamicLinks';

const dynamicLinks = firebasedynamiclinks('v1');
const mockCreate = dynamicLinks.shortLinks.create as jest.Mock;

jest.mock('../../../content/content.json', () => ({
  i18n: {
    en: {
      exercises: {
        'some-exercise-id': {
          name: 'Some Exercise',
          card: {
            image: {
              source: 'http://some.image/source.en',
            },
          },
        },
      },
      'DeepLink.JoinSessionInvite': {
        title: 'Some link title: {{name}}',
        description: 'Some link description: {{host}}',
      },
    },
    sv: {
      exercises: {
        'some-exercise-id': {
          name: 'En Övning',
          card: {
            image: {
              source: 'http://some.image/source.sv',
            },
          },
        },
      },
      'DeepLink.JoinSessionInvite': {
        title: 'En länktitel: {{name}}',
        description: 'En länkbeskrivning: {{host}}',
      },
    },
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('createDynamicLink', () => {
  it('creates a dynamic link', async () => {
    mockCreate.mockResolvedValueOnce({
      data: {
        shortLink: 'https://some.short/link',
      },
    });

    const shortLink = await createDynamicLink('some/path');

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      key: 'some-deep-link-api-key',
      requestBody: {
        dynamicLinkInfo: {
          androidInfo: {
            androidFallbackLink: 'http://some.android/fallback/link',
            androidPackageName: 'some-deep-link-android-package-name',
          },
          domainUriPrefix: 'some-deep-link-domain-uri-prefix',
          iosInfo: {
            iosFallbackLink: 'http://some.ios/fallback/link',
            iosAppStoreId: 'some-deep-link-ios-appstore-id',
            iosBundleId: 'some-deep-link-ios-bundle-id',
          },
          link: 'http://some.deep/link/base/some/path',
          navigationInfo: {enableForcedRedirect: false},
          socialMetaTagInfo: undefined,
        },
      },
    });

    expect(shortLink).toBe('https://some.short/link');
  });

  it('supports social media tag info', async () => {
    mockCreate.mockResolvedValueOnce({
      data: {
        shortLink: 'https://some.short/link',
      },
    });

    const shortLink = await createDynamicLink('some/path', {
      socialTitle: 'Some Title',
      socialDescription: 'Some Description',
      socialImageLink: 'https://some.image/link',
    });

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      key: 'some-deep-link-api-key',
      requestBody: {
        dynamicLinkInfo: {
          androidInfo: {
            androidFallbackLink: 'http://some.android/fallback/link',
            androidPackageName: 'some-deep-link-android-package-name',
          },
          domainUriPrefix: 'some-deep-link-domain-uri-prefix',
          iosInfo: {
            iosFallbackLink: 'http://some.ios/fallback/link',
            iosAppStoreId: 'some-deep-link-ios-appstore-id',
            iosBundleId: 'some-deep-link-ios-bundle-id',
          },
          link: 'http://some.deep/link/base/some/path',
          navigationInfo: {enableForcedRedirect: false},
          socialMetaTagInfo: {
            socialTitle: 'Some Title',
            socialDescription: 'Some Description',
            socialImageLink: 'https://some.image/link',
          },
        },
      },
    });

    expect(shortLink).toBe('https://some.short/link');
  });

  it('returns undefined when result is falsy', async () => {
    mockCreate.mockResolvedValueOnce({
      data: {
        shortLink: null,
      },
    });

    const shortLink = await createDynamicLink('some/path');

    expect(shortLink).toBe(undefined);
  });

  it('throws on errors', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Some Error'));

    await expect(createDynamicLink('some/path')).rejects.toThrow(
      new Error('Failed creating dynamic link'),
    );
  });
});

describe('createSessionInviteLink', () => {
  it('creates a dynamic link', async () => {
    mockCreate.mockResolvedValueOnce({
      data: {
        shortLink: 'https://some.short/session/link',
      },
    });

    const shortLink = await createSessionInviteLink(
      123456,
      'some-exercise-id',
      'Some Host Name',
      'en',
    );

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      key: 'some-deep-link-api-key',
      requestBody: {
        dynamicLinkInfo: {
          androidInfo: {
            androidFallbackLink: 'http://some.android/fallback/link',
            androidPackageName: 'some-deep-link-android-package-name',
          },
          domainUriPrefix: 'some-deep-link-domain-uri-prefix',
          iosInfo: {
            iosFallbackLink: 'http://some.ios/fallback/link',
            iosAppStoreId: 'some-deep-link-ios-appstore-id',
            iosBundleId: 'some-deep-link-ios-bundle-id',
          },
          link: 'http://some.deep/link/base/joinSessionInvite/123456',
          navigationInfo: {enableForcedRedirect: false},
          socialMetaTagInfo: {
            socialDescription: 'Some link description: Some Host Name',
            socialImageLink: 'http://some.image/source.en',
            socialTitle: 'Some link title: Some Exercise',
          },
        },
      },
    });

    expect(shortLink).toBe('https://some.short/session/link');
  });

  it('localise the link', async () => {
    mockCreate.mockResolvedValueOnce({
      data: {
        shortLink: 'https://some.short/session/link',
      },
    });

    const shortLink = await createSessionInviteLink(
      123456,
      'some-exercise-id',
      'Some Host Name',
      'sv',
    );

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      key: 'some-deep-link-api-key',
      requestBody: {
        dynamicLinkInfo: {
          androidInfo: {
            androidFallbackLink: 'http://some.android/fallback/link',
            androidPackageName: 'some-deep-link-android-package-name',
          },
          domainUriPrefix: 'some-deep-link-domain-uri-prefix',
          iosInfo: {
            iosFallbackLink: 'http://some.ios/fallback/link',
            iosAppStoreId: 'some-deep-link-ios-appstore-id',
            iosBundleId: 'some-deep-link-ios-bundle-id',
          },
          link: 'http://some.deep/link/base/joinSessionInvite/123456',
          navigationInfo: {enableForcedRedirect: false},
          socialMetaTagInfo: {
            socialDescription: 'En länkbeskrivning: Some Host Name',
            socialImageLink: 'http://some.image/source.sv',
            socialTitle: 'En länktitel: En Övning',
          },
        },
      },
    });

    expect(shortLink).toBe('https://some.short/session/link');
  });
});

describe('createPublicHostCodeLink', () => {
  it('creates a dynamic link', async () => {
    mockCreate.mockResolvedValueOnce({
      data: {
        shortLink: 'https://some.short/hostCode/link',
      },
    });

    const shortLink = await createPublicHostCodeLink(1337);

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      key: 'some-deep-link-api-key',
      requestBody: {
        dynamicLinkInfo: {
          androidInfo: {
            androidFallbackLink: 'http://some.android/fallback/link',
            androidPackageName: 'some-deep-link-android-package-name',
          },
          domainUriPrefix: 'some-deep-link-domain-uri-prefix',
          iosInfo: {
            iosFallbackLink: 'http://some.ios/fallback/link',
            iosAppStoreId: 'some-deep-link-ios-appstore-id',
            iosBundleId: 'some-deep-link-ios-bundle-id',
          },
          link: 'http://some.deep/link/base/verifyPublicHostCode/1337',
          navigationInfo: {enableForcedRedirect: false},
        },
      },
    });

    expect(shortLink).toBe('https://some.short/hostCode/link');
  });
});
