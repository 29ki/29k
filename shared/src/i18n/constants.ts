// LANGUAGES defines the supported languages and their tags
export enum LANGUAGES {
  en = 'English',
  pt = 'Português (Portugal)',
  sv = 'Svenska',
  ja = '日本語',
  da = 'Dansk',
  cs = 'Čeština',
  nl = 'Nederlands',
  es = 'Español',
  'pt-BR' = 'Português (Brasil)',
}

export type LANGUAGE_TAG = keyof typeof LANGUAGES;

// LANGUAGE_TAGS defines the supported languages
export const LANGUAGE_TAGS = Object.keys(LANGUAGES) as LANGUAGE_TAG[];

// CLIENT_LANGUAGE_TAGS defines the fully supported client language tags
export const CLIENT_LANGUAGE_TAGS: LANGUAGE_TAG[] = ['en', 'sv', 'pt'];

// DEFAULT_LANGUAGE defines the default language is used when a translation for
// a specific language is missing and will also be the default for all users,
// unless overridden.
export const DEFAULT_LANGUAGE_TAG: LANGUAGE_TAG = 'en';

// DEFAULT_TIME_LOCATION is the time location used as a fallback for users that
// doesn't have one set.
export const DEFAULT_TIME_LOCATION = 'UTC';

export enum CURRENCIES {
  USD = 'USD',
  EUR = 'EUR',
  SEK = 'SEK',
}

export type CURRENCY_CODE = keyof typeof CURRENCIES;

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CURRENCY_CODE[];

export const DEFAULT_CURRENCY_CODE: CURRENCY_CODE = CURRENCIES.EUR;
