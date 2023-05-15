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
          published: true,
          name: 'Some Exercise',
          description: 'Some description',
          card: {
            image: {
              source: 'http://some.image/source.en',
            },
          },
        },
        'some-socialMeta-exercise-id': {
          published: true,
          name: 'Some Other Exercise',
          description: 'Some description',
          socialMeta: {
            title: 'Some custom social meta title',
            description: 'Some custom social meta description',
            image: 'http://some.custom.social.meta/image',
          },
        },
      },
      'DeepLink.JoinSessionInvite': {
        title: 'Some link title: {{title}}',
        description: 'Some link description: {{host}} - {{description}}',
      },
    },
    sv: {
      exercises: {
        'some-exercise-id': {
          published: true,
          name: 'En Övning',
          description: 'En beskrivning',
          card: {
            image: {
              source: 'http://some.image/source.sv',
            },
          },
          socialMeta: {
            title: '',
            description: '',
            image: '',
          },
        },
      },
      'DeepLink.JoinSessionInvite': {
        title: 'En länktitel: {{title}}',
        description: 'En länkbeskrivning: {{host}} - {{description}}',
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
            androidPackageName: 'some-deep-link-android-package-name',
          },
          domainUriPrefix: 'some-deep-link-domain-uri-prefix',
          iosInfo: {
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
            androidPackageName: 'some-deep-link-android-package-name',
          },
          domainUriPrefix: 'some-deep-link-domain-uri-prefix',
          iosInfo: {
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
            androidPackageName: 'some-deep-link-android-package-name',
          },
          domainUriPrefix: 'some-deep-link-domain-uri-prefix',
          iosInfo: {
            iosAppStoreId: 'some-deep-link-ios-appstore-id',
            iosBundleId: 'some-deep-link-ios-bundle-id',
          },
          link: 'http://some.deep/link/base/joinSessionInvite/123456',
          navigationInfo: {enableForcedRedirect: false},
          socialMetaTagInfo: {
            socialDescription:
              'Some link description: Some Host Name - Some description',
            socialImageLink: 'http://some.image/source.en',
            socialTitle: 'Some link title: Some Exercise',
          },
        },
      },
    });

    expect(shortLink).toBe('https://some.short/session/link');
  });

  it('supports custom social meta override', async () => {
    mockCreate.mockResolvedValueOnce({
      data: {
        shortLink: 'https://some.short/session/link',
      },
    });

    const shortLink = await createSessionInviteLink(
      123456,
      'some-socialMeta-exercise-id',
      'Some Host Name',
      'en',
    );

    expect(mockCreate).toHaveBeenCalledTimes(1);
    expect(mockCreate).toHaveBeenCalledWith({
      key: 'some-deep-link-api-key',
      requestBody: {
        dynamicLinkInfo: {
          androidInfo: {
            androidPackageName: 'some-deep-link-android-package-name',
          },
          domainUriPrefix: 'some-deep-link-domain-uri-prefix',
          iosInfo: {
            iosAppStoreId: 'some-deep-link-ios-appstore-id',
            iosBundleId: 'some-deep-link-ios-bundle-id',
          },
          link: 'http://some.deep/link/base/joinSessionInvite/123456',
          navigationInfo: {enableForcedRedirect: false},
          socialMetaTagInfo: {
            socialDescription:
              'Some link description: Some Host Name - Some custom social meta description',
            socialImageLink: 'http://some.custom.social.meta/image',
            socialTitle: 'Some link title: Some custom social meta title',
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
            androidPackageName: 'some-deep-link-android-package-name',
          },
          domainUriPrefix: 'some-deep-link-domain-uri-prefix',
          iosInfo: {
            iosAppStoreId: 'some-deep-link-ios-appstore-id',
            iosBundleId: 'some-deep-link-ios-bundle-id',
          },
          link: 'http://some.deep/link/base/joinSessionInvite/123456',
          navigationInfo: {enableForcedRedirect: false},
          socialMetaTagInfo: {
            socialDescription:
              'En länkbeskrivning: Some Host Name - En beskrivning',
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
            androidPackageName: 'some-deep-link-android-package-name',
          },
          domainUriPrefix: 'some-deep-link-domain-uri-prefix',
          iosInfo: {
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
