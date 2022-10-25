import Router from '@koa/router';
import {DefaultState} from 'koa';
import {FirebaseAuthContext} from '../api/lib/firebaseAuth';
import {LanguageContext} from '../api/lib/languageResolver';
import {SlackContext} from '../slack/lib/verifySlackRequest';

export const createRouter = () =>
  new Router<DefaultState, LanguageContext & FirebaseAuthContext>();

export const cerateSlackRouter = () => new Router<DefaultState, SlackContext>();
