/*
Firebase functions supports .env ...
https://firebase.google.com/docs/functions/config-env

...but only during runtime and not at deploy or even bootstrap.
https://github.com/firebase/firebase-functions/issues/1065
https://github.com/firebase/firebase-functions/issues/1044
https://github.com/firebase/firebase-tools/issues/4656

We therefore shim this with the dotenv library
*/
import 'dotenv/config';
import {cleanEnv, str} from 'envalid';

const configValidation = {
  AIRBRIDGE_API_TOKEN: str(),
  BACKUPS_BUCKET: str(),
  DAILY_API_KEY: str(),
  DAILY_DOMAIN_ID: str(),
  DAILY_ID_SALT: str(),
  DEEP_LINK_SCHEME: str(),
  ENVIRONMENT: str(),
  GIT_COMMIT_SHORT: str(),
  OPENAI_API_KEY: str(),
  SENDGRID_API_KEY: str(),
  SENTRY_DSN: str(),
  SLACK_BOT_NAME: str(),
  SLACK_FEEDBACK_CHANNEL: str(),
  SLACK_OAUTH_TOKEN: str(),
  SLACK_PUBLIC_HOST_REQUESTS_CHANNEL: str(),
  SLACK_SHARING_POSTS_CHANNEL: str(),
  SLACK_SIGNING_SECRET: str(),
  STRIPE_API_KEY: str(),
};

export default cleanEnv(process.env, configValidation);
