"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TIME_LOCATION = exports.DEFAULT_LANGUAGE_TAG = exports.LANGUAGE_TAGS = exports.LANGUAGES = void 0;
// LANGUAGES defines the supported languages and their tags
exports.LANGUAGES = {
    en: 'English',
    sv: 'Svenska',
    pt: 'Português',
};
// LANGUAGE_TAGS defines the supported languages
exports.LANGUAGE_TAGS = Object.keys(exports.LANGUAGES);
// DEFAULT_LANGUAGE defines the default language is used when a translation for
// a specific language is missing and will also be the default for all users,
// unless overridden.
exports.DEFAULT_LANGUAGE_TAG = 'en';
// DEFAULT_TIME_LOCATION is the time location used as a fallback for users that
// doesn't have one set.
exports.DEFAULT_TIME_LOCATION = 'UTC';
//# sourceMappingURL=i18n.js.map