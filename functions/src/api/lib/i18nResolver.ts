/*
In abscense of a good i18next koa middleware
*/
import {Context, Next} from 'koa';
import i18n from '../../lib/i18n';

const i18nResolver = () => async (ctx: Context, next: Next) => {
  const lng =
    typeof ctx.query.lng === 'string' ? ctx.query.lng : i18n.resolvedLanguage;

  ctx.i18n = i18n.cloneInstance({
    lng,
  });

  await next();
};

export default i18nResolver;
