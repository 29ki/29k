import languageResolver, {LanguageContext} from './languageResolver';
import {createMockContext} from '@shopify/jest-koa-mocks';

jest.mock('../../lib/i18n', () => ({
  LANGUAGE_TAGS: ['some-query-language', 'some-header-language'],
  DEFAULT_LANGUAGE_TAG: 'some-default-language-tag',
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe('languageResolver', () => {
  it('supports language query param', async () => {
    const middleware = languageResolver();
    const ctx = createMockContext({
      url: '?language=some-query-language',
    }) as LanguageContext;

    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.language).toEqual('some-query-language');
  });

  it('supports Accept-Language header', async () => {
    const middleware = languageResolver();
    const ctx = createMockContext({
      headers: {'Accept-Language': 'some-header-language'},
    }) as LanguageContext;

    const acceptsLanguagesSpy = jest.spyOn(ctx, 'acceptsLanguages');

    const next = jest.fn();

    await middleware(ctx, next);

    expect(acceptsLanguagesSpy).toHaveBeenCalledWith([
      'some-default-language-tag',
      'some-query-language',
      'some-header-language',
    ]);
    expect(acceptsLanguagesSpy).toHaveBeenCalledTimes(1);

    expect(ctx.language).toEqual('some-header-language');
  });

  it('sets defaults language if Accept-Language language is not supported', async () => {
    const middleware = languageResolver();
    const ctx = createMockContext({
      headers: {'Accept-Language': 'some-unsupported-header-language'},
    }) as LanguageContext;

    const next = jest.fn();

    await middleware(ctx, next);

    expect(ctx.language).toEqual('some-default-language-tag');
  });

  it('priorities query param over Accept-Language header', async () => {
    const middleware = languageResolver();
    const ctx = createMockContext({
      url: '?language=some-query-language',
      headers: {'Accept-Language': 'some-header-language'},
    }) as LanguageContext;

    const acceptsLanguagesSpy = jest.spyOn(ctx, 'acceptsLanguages');

    const next = jest.fn();

    await middleware(ctx, next);

    expect(acceptsLanguagesSpy).toHaveBeenCalledTimes(0);

    expect(ctx.language).toEqual('some-query-language');
  });

  it('sets default language if no language is supplied', async () => {
    const middleware = languageResolver();

    const ctx = createMockContext() as LanguageContext;

    const acceptsLanguagesSpy = jest.spyOn(ctx, 'acceptsLanguages');

    const next = jest.fn();

    await middleware(ctx, next);

    expect(acceptsLanguagesSpy).toHaveBeenCalledWith([
      'some-default-language-tag',
      'some-query-language',
      'some-header-language',
    ]);
    expect(acceptsLanguagesSpy).toHaveBeenCalledTimes(1);

    expect(ctx.language).toEqual('some-default-language-tag');
  });
});
