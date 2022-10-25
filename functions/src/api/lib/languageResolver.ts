import {Context, Next} from 'koa';
import {DEFAULT_LANGUAGE_TAG, LANGUAGE_TAGS} from '../../lib/i18n';

export type LanguageContext = Context & {
  language: string;
};

const languageResolver = () => async (ctx: LanguageContext, next: Next) => {
  const language =
    typeof ctx.query.language === 'string'
      ? // Resolve from query param
        ctx.query.language
      : // Resolve from Accept-Language header
        ctx.acceptsLanguages([DEFAULT_LANGUAGE_TAG, ...LANGUAGE_TAGS]) ||
        DEFAULT_LANGUAGE_TAG;

  ctx.language = language;

  await next();
};

export default languageResolver;
