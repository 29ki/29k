import i18nResolver from './i18nResolver';
import i18n from '../../lib/i18n';
import {createMockContext} from '@shopify/jest-koa-mocks';

jest.mock('../../lib/i18n', () => ({
  cloneInstance: jest.fn(),
  LANGUAGE_TAGS: ['some-query-language', 'some-header-language'],
  DEFAULT_LANGUAGE_TAG: 'some-default-language-tag',
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe('i18nResolver', () => {
  it('supports lng query param', async () => {
    const middleware = i18nResolver();
    const ctx = createMockContext({
      url: '?lng=some-query-language',
    });

    const next = jest.fn();

    await middleware(ctx, next);

    expect(i18n.cloneInstance).toHaveBeenCalledTimes(1);
    expect(i18n.cloneInstance).toHaveBeenCalledWith({
      lng: 'some-query-language',
    });
  });

  it('supports Accept-Language header', async () => {
    const middleware = i18nResolver();
    const ctx = createMockContext({
      headers: {'Accept-Language': 'some-header-language'},
    });

    const acceptsLanguagesSpy = jest.spyOn(ctx, 'acceptsLanguages');

    const next = jest.fn();

    await middleware(ctx, next);

    expect(acceptsLanguagesSpy).toHaveBeenCalledWith([
      'some-default-language-tag',
      'some-query-language',
      'some-header-language',
    ]);
    expect(acceptsLanguagesSpy).toHaveBeenCalledTimes(1);

    expect(i18n.cloneInstance).toHaveBeenCalledTimes(1);
    expect(i18n.cloneInstance).toHaveBeenCalledWith({
      lng: 'some-header-language',
    });
  });

  it('sets defaults language if Accept-Language language is not supported', async () => {
    const middleware = i18nResolver();
    const ctx = createMockContext({
      headers: {'Accept-Language': 'some-unsupported-header-language'},
    });

    const next = jest.fn();

    await middleware(ctx, next);

    expect(i18n.cloneInstance).toHaveBeenCalledTimes(1);
    expect(i18n.cloneInstance).toHaveBeenCalledWith({
      lng: 'some-default-language-tag',
    });
  });

  it('priorities query param over Accept-Language header', async () => {
    const middleware = i18nResolver();
    const ctx = createMockContext({
      url: '?lng=some-query-language',
      headers: {'Accept-Language': 'some-header-language'},
    });

    const acceptsLanguagesSpy = jest.spyOn(ctx, 'acceptsLanguages');

    const next = jest.fn();

    await middleware(ctx, next);

    expect(acceptsLanguagesSpy).toHaveBeenCalledTimes(0);

    expect(i18n.cloneInstance).toHaveBeenCalledTimes(1);
    expect(i18n.cloneInstance).toHaveBeenCalledWith({
      lng: 'some-query-language',
    });
  });

  it('sets default language if no language is supplied', async () => {
    const middleware = i18nResolver();

    const ctx = createMockContext();

    const acceptsLanguagesSpy = jest.spyOn(ctx, 'acceptsLanguages');

    const next = jest.fn();

    await middleware(ctx, next);

    expect(acceptsLanguagesSpy).toHaveBeenCalledWith([
      'some-default-language-tag',
      'some-query-language',
      'some-header-language',
    ]);
    expect(acceptsLanguagesSpy).toHaveBeenCalledTimes(1);

    expect(i18n.cloneInstance).toHaveBeenCalledTimes(1);
    expect(i18n.cloneInstance).toHaveBeenCalledWith({
      lng: 'some-default-language-tag',
    });
  });
});
