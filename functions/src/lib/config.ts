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

export default cleanEnv(process.env, {
  DAILY_API_KEY: str(),
  DAILY_API_URL: str(),
  DAILY_API_VERSION: str(),
});
