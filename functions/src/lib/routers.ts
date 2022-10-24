import Router from '@koa/router';
import {DefaultState} from 'koa';
import {FirebaseAuthContext} from '../api/lib/firebaseAuth';
import {I18nContext} from '../api/lib/i18nResolver';
import {SlackAuthContext} from '../api/lib/verifySlackRequest';

export const createRouter = () =>
  new Router<DefaultState, I18nContext & FirebaseAuthContext>();

export const cerateSlackRouter = () =>
  new Router<DefaultState, SlackAuthContext>();
