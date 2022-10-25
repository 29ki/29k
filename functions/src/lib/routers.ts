import Router from '@koa/router';
import {DefaultState} from 'koa';
import {FirebaseAuthContext} from '../api/lib/firebaseAuth';
import {LanguageContext} from '../api/lib/languageResolver';

export const createRouter = () =>
  new Router<DefaultState, LanguageContext & FirebaseAuthContext>();
