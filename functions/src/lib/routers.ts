import Router from '@koa/router';
import {DefaultState} from 'koa';
import {FirebaseAuthContext} from '../api/lib/firebaseAuth';
import {I18nContext} from '../api/lib/i18nResolver';

export const createAuthorizedRouter = () =>
  new Router<DefaultState, I18nContext & FirebaseAuthContext>();

export const createUnauthorizedRouter = () =>
  new Router<DefaultState, I18nContext>();
