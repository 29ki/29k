import request from 'supertest';

import {killSwitchRouter} from './index';
import createMockServer from '../lib/createMockServer';

import {createApiRouter} from '../../lib/routers';

jest.mock('../../../../content/content.json', () => ({
  i18n: {
    en: {
      'Screen.KillSwitch': {
        update: {
          image__image: 'update image',
          android: {
            text__markdown: 'android update text',
            link: 'android update link',
            button: 'android update button',
          },
          ios: {
            text__markdown: 'ios update text',
            link: 'ios update link',
            button: 'ios update button',
          },
        },
        maintenance: {
          image__image: 'maintenance image',
          text__markdown: 'maintenance text',
        },
      },
    },
    sv: {
      'Screen.KillSwitch': {
        update: {
          image__image: 'uppdatera bild',
          android: {
            text__markdown: 'android uppdatera text',
            link: 'android uppdatera länk',
            button: 'android uppdatera knapp',
          },
          ios: {
            text__markdown: 'ios uppdatera text',
            link: 'ios uppdatera länk',
            button: 'ios uppdatera knapp',
          },
        },
        maintenance: {
          image__image: 'underhåll bild',
          text__markdown: 'underhåll text',
        },
      },
    },
  },
}));

const router = createApiRouter();
router.use('/killSwitch', killSwitchRouter.routes());
const mockServer = createMockServer(router.routes(), router.allowedMethods());

afterAll(() => {
  mockServer.close();
});

describe('/api/killswitch', () => {
  describe('Mixed', () => {
    const nativeUpdate = expect.objectContaining({
      message: expect.any(String),
      permanent: true,
    });
    const bundleUpdate = {requiresBundleUpdate: true};
    it.each([
      ////// native version //////////////////////////////////////////////////
      // older native versions currently kill-switched
      [403, nativeUpdate, '1.0.0', undefined, 'ios', 'en'],
      [403, nativeUpdate, '1.0.0', undefined, 'ios', 'en'],
      [403, nativeUpdate, '1.0.0', undefined, 'ios', 'en'],

      // current native minimum version
      [200, {}, '2.16.0', '10001', 'ios', 'en'],
      [200, {}, '2.16.0', '10001', 'android', 'en'],

      // some future version
      [200, {}, '3.0.0', undefined, 'ios', 'en'],
      [200, {}, '3.0.0', undefined, 'ios', 'sv'],
      [200, {}, '3.0.0', undefined, 'android', 'en'],

      ////// bundle version //////////////////////////////////////////////////
      // native version is more important than bundle version
      [403, nativeUpdate, '1.0.0', '1', 'ios', 'en'],

      // older bundle versions currently kill-switched
      [200, bundleUpdate, '2.16.0', '2993', 'ios', 'en'],
      [200, bundleUpdate, '2.16.0', '2872', 'android', 'en'],

      // current bundle minimum version
      [200, {}, '2.16.0', '10001', 'ios', 'en'],
      [200, {}, '2.16.0', '10001', 'android', 'en'],

      /////// miscellaneous //////////////////////////////////////////////////
      // accepts partially broken input
      [200, {}, '3.0.0', 'undefined', 'ios', 'en'],

      // doesn't require language (defaults to english)
      [403, nativeUpdate, '1.0.0', undefined, 'ios', undefined],
      [200, {}, '3.0.0', undefined, 'android', undefined],
    ])(
      'Returns %s and %s for %s on %s with %s language',
      async (status, body, version, bundleVersion, platform, language) => {
        const response = await request(mockServer).get(
          `/killSwitch?platform=${platform}&platformVersion=10&version=${version}&bundleVersion=${bundleVersion}&language=${language}`,
        );

        expect(response.status).toBe(status);
        expect(response.body).toEqual(body);
      },
    );
  });

  describe('Failure', () => {
    it('Should handle incorrect query params', async () => {
      const response = await request(mockServer).get(`/killSwitch`);

      expect(response.status).toBe(500);
    });

    it('Should handle incorrect platform', async () => {
      const version = '10.0.0';
      const platform = 'windows';
      const bundleVersion = '5000';
      const language = 'en';

      const response = await request(mockServer).get(
        `/killSwitch?platform=${platform}&platformVersion=10&version=${version}&bundleVersion=${bundleVersion}&language=${language}`,
      );

      expect(response.status).toBe(500);
    });

    it('Should handle incorrect version', async () => {
      const version = 'incorrect';
      const platform = 'ios';
      const bundleVersion = '5000';
      const language = 'en';

      const response = await request(mockServer).get(
        `/killSwitch?platform=${platform}&platformVersion=10&version=${version}&bundleVersion=${bundleVersion}&language=${language}`,
      );

      expect(response.status).toBe(500);
    });

    it('Should handle incorrect bundleVersion', async () => {
      const version = '10.0.0';
      const platform = 'ios';
      const bundleVersion = 'incorrect';
      const language = 'en';

      const response = await request(mockServer).get(
        `/killSwitch?platform=${platform}&platformVersion=10&version=${version}&bundleVersion=${bundleVersion}&language=${language}`,
      );

      expect(response.status).toBe(200);
    });

    it('Should respond with appStore update message', async () => {
      const version = '1.0.0';
      const platform = 'ios';
      const bundleVersion = '3000';
      const language = 'en';

      const response = await request(mockServer).get(
        `/killSwitch?platform=${platform}&platformVersion=10&version=${version}&bundleVersion=${bundleVersion}&language=${language}`,
      );

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        button: {
          link: 'ios update link',
          text: 'ios update button',
        },
        image: 'update image',
        message: 'ios update text',
        permanent: true,
      });
    });

    it('Should respond with play store update message', async () => {
      const version = '1.0.0';
      const platform = 'android';
      const bundleVersion = '3000';
      const language = 'en';

      const response = await request(mockServer).get(
        `/killSwitch?platform=${platform}&platformVersion=10&version=${version}&bundleVersion=${bundleVersion}&language=${language}`,
      );

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        button: {
          link: 'android update link',
          text: 'android update button',
        },
        image: 'update image',
        message: 'android update text',
        permanent: true,
      });
    });

    it('Should support other languages', async () => {
      const version = '1.0.0';
      const platform = 'android';
      const bundleVersion = '3000';
      const language = 'sv';

      const response = await request(mockServer).get(
        `/killSwitch?platform=${platform}&platformVersion=10&version=${version}&bundleVersion=${bundleVersion}&language=${language}`,
      );

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        button: {
          link: 'android uppdatera länk',
          text: 'android uppdatera knapp',
        },
        image: 'uppdatera bild',
        message: 'android uppdatera text',
        permanent: true,
      });
    });

    it('Should fallback to english for unsupported language', async () => {
      const version = '1.0.0';
      const platform = 'android';
      const bundleVersion = '3000';
      const language = 'unsupported';

      const response = await request(mockServer).get(
        `/killSwitch?platform=${platform}&platformVersion=10&version=${version}&bundleVersion=${bundleVersion}&language=${language}`,
      );

      expect(response.status).toBe(403);
      expect(response.body).toEqual({
        button: {
          link: 'android update link',
          text: 'android update button',
        },
        image: 'update image',
        message: 'android update text',
        permanent: true,
      });
    });
  });
});
