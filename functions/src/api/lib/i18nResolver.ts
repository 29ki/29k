/*
In abscense of a good i18next koa middleware
*/
import {Context, Next} from 'koa';
import i18n, {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
  I18nInterface,
} from '../../lib/i18n';

export type I18nContext = Context & {
  i18n: I18nInterface;
};

const i18nResolver = () => async (ctx: I18nContext, next: Next) => {
  const lng =
    typeof ctx.query.lng === 'string'
      ? // Resolve from query param
        ctx.query.lng
      : // Resolve from Accept-Language header
        ctx.acceptsLanguages([DEFAULT_LANGUAGE_TAG, ...LANGUAGE_TAGS]) ||
        DEFAULT_LANGUAGE_TAG;

  ctx.i18n = i18n.cloneInstance({
    lng,
  });

  await next();
};

export default i18nResolver;
