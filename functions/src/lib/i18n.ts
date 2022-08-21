import i18next, {init} from 'i18next';

import resources from '../../../content/content.json';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../shared/src/constants/i18n';

init({
  lng: DEFAULT_LANGUAGE_TAG,
  supportedLngs: LANGUAGE_TAGS,
  fallbackLng: DEFAULT_LANGUAGE_TAG,
  resources,
});

export default i18next;
