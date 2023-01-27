import Router from '@koa/router';
import {DefaultState} from 'koa';
import {FirebaseAuthContext} from '../api/lib/firebaseAuth';
import {LanguageContext} from '../api/lib/languageResolver';
import {SlackContext} from '../slack/lib/verifySlackRequest';

export const createApiRouter = () =>
  new Router<DefaultState, LanguageContext & FirebaseAuthContext>();

export const createSlackRouter = () => new Router<DefaultState, SlackContext>();

export const createMetricsRouter = () => new Router<DefaultState>();
