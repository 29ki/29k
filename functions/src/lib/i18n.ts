import i18next, {init} from 'i18next';

import content from '../../../content/content.json';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../shared/src/constants/i18n';

export * from '../../../shared/src/constants/i18n';
export type {i18n as I18nInterface} from 'i18next';

init({
  lng: DEFAULT_LANGUAGE_TAG,
  supportedLngs: LANGUAGE_TAGS,
  fallbackLng: DEFAULT_LANGUAGE_TAG,
  resources: content.i18n,
});

export default i18next;
