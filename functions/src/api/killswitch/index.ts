import * as yup from 'yup';
import validator from 'koa-yup-validator';
import {lt, valid} from 'semver';
import {createRouter} from '../../lib/routers';
import i18next from '../../lib/i18n';

// Binary kill switch, this will permanently disable the entire app.
// USE WITH CAUTION!
const KILL_SWITCH = false;

// Specify the minimum required app native version.
const MIN_APP_VERSION = '2.12.0';

// Specify the minimum required bundle version.
const MIN_BUNDLE_VERSION: {[key: string]: {android: number; ios: number}} = {
  [MIN_APP_VERSION]: {
    // Allways require update to the latest version
    android: 10000,
    ios: 10000,
  },
};

type AcceptedPlatforms = 'android' | 'ios';

const acceptedPlatforms = ['android', 'ios'];

const acceptedBundleVersion = (
  platform: AcceptedPlatforms,
  version: string,
  bundleVersion: string,
) => {
  if (!(version in MIN_BUNDLE_VERSION)) {
    return true;
  }

  const bundleVersionNumber = Number.parseInt(bundleVersion, 10);

  // If no bundleVersion is received, the client has never updated
  if (Number.isNaN(bundleVersionNumber)) {
    return false;
  }

  return bundleVersionNumber >= MIN_BUNDLE_VERSION[version][platform];
};

const router = createRouter();

type RequestQuery = {
  version: string;
  bundleVersion: string;
  platform: AcceptedPlatforms;
};

const killSwitchQuerySchema = yup.object().shape({
  version: yup
    .string()
    .test('semver', 'incorrect version', test => Boolean(valid(test)))
    .required(),
  platform: yup.string().oneOf(acceptedPlatforms).required(),
  bundleVersion: yup.string(),
});

export const killSwitchRouter = router.get(
  '/',
  validator({query: killSwitchQuerySchema}),
  ctx => {
    const {request, response, language} = ctx;
    const {version, bundleVersion, platform} = request.query as RequestQuery;

    const t = i18next.getFixedT(language, 'Screen.KillSwitch');

    if (KILL_SWITCH) {
      response.status = 403;
      ctx.body = {
        image: t('maintenance.image__image'),
        message: t('maintenance.text__markdown'),
        permanent: false,
      };
      return;
    }

    if (lt(version, MIN_APP_VERSION)) {
      response.status = 403;
      ctx.body = {
        image: t('update.image__image'),
        message: t(`update.${platform}.text__markdown`),
        button: {
          text: t(`update.${platform}.button`),
          link: t(`update.${platform}.link`),
        },
        permanent: true,
      };
      return;
    }

    if (!acceptedBundleVersion(platform, version, bundleVersion)) {
      response.status = 200;
      ctx.body = {requiresBundleUpdate: true};
      return;
    }

    response.status = 200;
    ctx.body = '';
    return;
  },
);
