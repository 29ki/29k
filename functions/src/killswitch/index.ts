import { onRequest } from "firebase-functions/v2/https";
import { lt, valid } from "semver";
import { getFakeT } from "../lib/fakeI18Next";

import translations from "./translations";

// Binary kill switch, this will permanently disable the entire app.
// USE WITH CAUTION!
const KILL_SWITCH = false;

// Specify the minimum required app native version.
const MIN_APP_VERSION = "1.32.2";

// Specify the minimum required bundle version.
//
// We started sending bundleVersion in version 1.30 bundle 2300/2420. iOS is
// currently 120 versions ahead of Android.
const MIN_BUNDLE_VERSION: { [key: string]: { android: number; ios: number } } =
  {
    "1.32.2": {
      android: 2873,
      ios: 2994,
    },
  };

type AcceptedPlatforms = "android" | "ios";

const acceptedPlatforms = ["android", "ios"];

const acceptedBundleVersion = (
  platform: AcceptedPlatforms,
  version: string,
  bundleVersion: string
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

type RequestQuery = {
  version: string;
  bundleVersion: string;
  platform: AcceptedPlatforms;
  language: string;
};

export const killswitch = onRequest(
  {
    memory: "256MiB",
    maxInstances: 1024,
    minInstances: 1,
  },
  (request, response) => {
    const { version, bundleVersion, platform, language } =
      request.query as RequestQuery;

    // We don't use the i18next library here because of slow initialization
    const t = getFakeT(language, "Screen.KillSwitch", undefined, translations);

    if (!valid(version) || !acceptedPlatforms.includes(platform)) {
      response.status(400).send();
      return;
    }

    if (KILL_SWITCH) {
      response.status(403).send({
        image: t(`maintenance.image__image`),
        message: t("maintenance.text__markdown"),
        permanent: false,
      });
      return;
    }

    if (lt(version, MIN_APP_VERSION)) {
      response.status(403).send({
        image: t(`update.image__image`),
        message: t(`update.${platform}.text__markdown`),
        button: {
          text: t(`update.${platform}.button`),
          link: t(`update.${platform}.link`),
        },
        permanent: true,
      });
      return;
    }

    if (!acceptedBundleVersion(platform, version, bundleVersion)) {
      response.status(200).send({ requiresBundleUpdate: true });
      return;
    }

    response.status(200).send();
    return;
  }
);
