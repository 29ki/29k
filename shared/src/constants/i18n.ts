// LANGUAGES defines the supported languages and their tags
export const LANGUAGES = {
  en: 'English',
  sv: 'Svenska',
  pt: 'Português',
};

// LANGUAGE_TAGS defines the supported languages
export const LANGUAGE_TAGS = Object.keys(LANGUAGES);

// DEFAULT_LANGUAGE defines the default language is used when a translation for
// a specific language is missing and will also be the default for all users,
// unless overridden.
export const DEFAULT_LANGUAGE_TAG = 'en';

// DEFAULT_TIME_LOCATION is the time location used as a fallback for users that
// doesn't have one set.
export const DEFAULT_TIME_LOCATION = 'UTC';
