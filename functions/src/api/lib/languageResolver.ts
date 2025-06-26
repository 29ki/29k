import {Context, Next} from 'koa';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../lib/i18n';

export type LanguageContext = Context & {
  language: LANGUAGE_TAG;
};

const languageResolver = () => async (ctx: LanguageContext, next: Next) => {
  const language =
    typeof ctx.query.language === 'string'
      ? // Resolve from query param
        ctx.query.language
      : // Resolve from Accept-Language header
        ctx.acceptsLanguages([DEFAULT_LANGUAGE_TAG, ...LANGUAGE_TAGS]) ||
        DEFAULT_LANGUAGE_TAG;

  // pt is the old way of writing Portuguese, we use pt-PT now. Could be removed in the future.
  ctx.language = (language === 'pt' ? 'pt-PT' : language) as LANGUAGE_TAG;

  await next();
};

export default languageResolver;
