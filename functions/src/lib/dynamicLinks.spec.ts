import {firebasedynamiclinks} from '@googleapis/firebasedynamiclinks';
import {createDynamicLink} from './dynamicLinks';

const dynamicLinks = firebasedynamiclinks('v1');
const mockCreate = dynamicLinks.shortLinks.create as jest.Mock;

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
          navigationInfo: {enableForcedRedirect: true},
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
          navigationInfo: {enableForcedRedirect: true},
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
