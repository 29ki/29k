import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';

enableFetchMocks();

import {
  createTrackingLink,
  createPublicHostCodeLink,
  createSessionInviteLink,
} from './airbridge';

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
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

describe('createTrackingLink', () => {
  it('creates a tracking link', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          trackingLink: {
            shortUrl: 'https://some.short/link',
          },
        },
      }),
    );

    const shortLink = await createTrackingLink('some/path');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.airbridge.io/v1/tracking-links',
      {
        body: JSON.stringify({
          deeplinkUrl: 'some-deep-link-domain-uri-prefix://some/path',
          channel: 'app',
          deeplinkOption: {showAlertForInitialDeeplinkingIssue: true},
          fallbackPaths: {android: 'google-play', ios: 'itunes-appstore'},
        }),
        headers: {
          'Accept-Language': 'en',
          Authorization: 'Bearer some-air-bridge-api-key',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    expect(shortLink).toBe('https://some.short/link');
  });

  it('supports social media tag info', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          trackingLink: {
            shortUrl: 'https://some.short/link',
          },
        },
      }),
    );

    const shortLink = await createTrackingLink('some/path', {
      title: 'Some Title',
      description: 'Some Description',
      imageUrl: 'https://some.image/link',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.airbridge.io/v1/tracking-links',
      {
        body: JSON.stringify({
          deeplinkUrl: 'some-deep-link-domain-uri-prefix://some/path',
          channel: 'app',
          deeplinkOption: {showAlertForInitialDeeplinkingIssue: true},
          fallbackPaths: {android: 'google-play', ios: 'itunes-appstore'},
          ogTag: {
            title: 'Some Title',
            description: 'Some Description',
            imageUrl: 'https://some.image/link',
          },
        }),
        headers: {
          'Accept-Language': 'en',
          Authorization: 'Bearer some-air-bridge-api-key',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    expect(shortLink).toBe('https://some.short/link');
  });

  it('throws on errors', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({error: 'Some error'}), {
      status: 500,
    });

    await expect(createTrackingLink('some/path')).rejects.toThrow(
      new Error('Failed creating tracking link'),
    );
  });
});

describe('createSessionInviteLink', () => {
  it('creates a tracking link', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          trackingLink: {
            shortUrl: 'https://some.short/session/link',
          },
        },
      }),
    );

    const shortLink = await createSessionInviteLink(
      123456,
      'some-exercise-id',
      'Some Host Name',
      'en',
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.airbridge.io/v1/tracking-links',
      {
        body: JSON.stringify({
          deeplinkUrl:
            'some-deep-link-domain-uri-prefix://joinSessionInvite/123456',
          channel: 'app',
          deeplinkOption: {showAlertForInitialDeeplinkingIssue: true},
          fallbackPaths: {android: 'google-play', ios: 'itunes-appstore'},
          ogTag: {
            imageUrl: 'http://some.image/source.en',
            title: 'Some link title: Some Exercise',
            description:
              'Some link description: Some Host Name - Some description',
          },
        }),
        headers: {
          'Accept-Language': 'en',
          Authorization: 'Bearer some-air-bridge-api-key',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    expect(shortLink).toBe('https://some.short/session/link');
  });

  it('supports custom social meta override', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          trackingLink: {
            shortUrl: 'https://some.short/session/link',
          },
        },
      }),
    );

    const shortLink = await createSessionInviteLink(
      123456,
      'some-socialMeta-exercise-id',
      'Some Host Name',
      'en',
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.airbridge.io/v1/tracking-links',
      {
        body: JSON.stringify({
          deeplinkUrl:
            'some-deep-link-domain-uri-prefix://joinSessionInvite/123456',
          channel: 'app',
          deeplinkOption: {showAlertForInitialDeeplinkingIssue: true},
          fallbackPaths: {android: 'google-play', ios: 'itunes-appstore'},
          ogTag: {
            imageUrl: 'http://some.custom.social.meta/image',
            title: 'Some link title: Some custom social meta title',
            description:
              'Some link description: Some Host Name - Some custom social meta description',
          },
        }),
        headers: {
          'Accept-Language': 'en',
          Authorization: 'Bearer some-air-bridge-api-key',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    expect(shortLink).toBe('https://some.short/session/link');
  });

  it('localise the link', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          trackingLink: {
            shortUrl: 'https://some.short/session/link',
          },
        },
      }),
    );

    const shortLink = await createSessionInviteLink(
      123456,
      'some-exercise-id',
      'Some Host Name',
      'sv',
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.airbridge.io/v1/tracking-links',
      {
        body: JSON.stringify({
          deeplinkUrl:
            'some-deep-link-domain-uri-prefix://joinSessionInvite/123456',
          channel: 'app',
          deeplinkOption: {showAlertForInitialDeeplinkingIssue: true},
          fallbackPaths: {android: 'google-play', ios: 'itunes-appstore'},
          ogTag: {
            imageUrl: 'http://some.image/source.sv',
            title: 'En länktitel: En Övning',
            description: 'En länkbeskrivning: Some Host Name - En beskrivning',
          },
        }),
        headers: {
          'Accept-Language': 'en',
          Authorization: 'Bearer some-air-bridge-api-key',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    expect(shortLink).toBe('https://some.short/session/link');
  });
});

describe('createPublicHostCodeLink', () => {
  it('creates a tracking link', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        data: {
          trackingLink: {
            shortUrl: 'https://some.short/hostCode/link',
          },
        },
      }),
    );

    const shortLink = await createPublicHostCodeLink(1337);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.airbridge.io/v1/tracking-links',
      {
        body: JSON.stringify({
          deeplinkUrl:
            'some-deep-link-domain-uri-prefix://verifyPublicHostCode/1337',
          channel: 'app',
          deeplinkOption: {showAlertForInitialDeeplinkingIssue: true},
          fallbackPaths: {android: 'google-play', ios: 'itunes-appstore'},
        }),
        headers: {
          'Accept-Language': 'en',
          Authorization: 'Bearer some-air-bridge-api-key',
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
    );

    expect(shortLink).toBe('https://some.short/hostCode/link');
  });
});
