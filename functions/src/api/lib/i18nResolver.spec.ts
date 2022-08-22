import i18nResolver from './i18nResolver';
import i18n from '../../lib/i18n';
import {Context} from 'koa';

jest.mock('../../lib/i18n', () => ({
  cloneInstance: jest.fn(),
  LANGUAGE_TAGS: ['some-supported-language-tag'],
  DEFAULT_LANGUAGE_TAG: 'some-default-language-tag',
}));

afterEach(() => {
  jest.resetAllMocks();
});

describe('i18nResolver', () => {
  it('supports lng query param', async () => {
    const middleware = i18nResolver();
    const ctx = {
      query: {
        lng: 'some-language',
      },
    };

    const next = jest.fn();

    await middleware(ctx as unknown as Context, next);

    expect(i18n.cloneInstance).toHaveBeenCalledTimes(1);
    expect(i18n.cloneInstance).toHaveBeenCalledWith({lng: 'some-language'});
  });

  it('supports Accept-Language header', async () => {
    const middleware = i18nResolver();

    const ctx = {
      query: {},
      acceptsLanguages: jest.fn().mockReturnValue('some-language'),
    };

    const next = jest.fn();

    await middleware(ctx as unknown as Context, next);

    expect(ctx.acceptsLanguages).toHaveBeenCalledWith([
      'some-supported-language-tag',
    ]);
    expect(ctx.acceptsLanguages).toHaveBeenCalledTimes(1);

    expect(i18n.cloneInstance).toHaveBeenCalledTimes(1);
    expect(i18n.cloneInstance).toHaveBeenCalledWith({lng: 'some-language'});
  });

  it('priorities query param over Accept-Language header', async () => {
    const middleware = i18nResolver();
    const ctx = {
      query: {
        lng: 'some-query-language',
      },
      acceptsLanguages: jest.fn().mockReturnValue('some-header-language'),
    };

    const next = jest.fn();

    await middleware(ctx as unknown as Context, next);

    expect(ctx.acceptsLanguages).toHaveBeenCalledTimes(0);

    expect(i18n.cloneInstance).toHaveBeenCalledTimes(1);
    expect(i18n.cloneInstance).toHaveBeenCalledWith({
      lng: 'some-query-language',
    });
  });

  it('sets default language if no language is supplied', async () => {
    const middleware = i18nResolver();

    const ctx = {
      query: {},
      acceptsLanguages: jest.fn(),
    };

    const next = jest.fn();

    await middleware(ctx as unknown as Context, next);

    expect(ctx.acceptsLanguages).toHaveBeenCalledWith([
      'some-supported-language-tag',
    ]);
    expect(ctx.acceptsLanguages).toHaveBeenCalledTimes(1);

    expect(i18n.cloneInstance).toHaveBeenCalledTimes(1);
    expect(i18n.cloneInstance).toHaveBeenCalledWith({
      lng: 'some-default-language-tag',
    });
  });
});
