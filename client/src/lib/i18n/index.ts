import 'intl-pluralrules';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';

import resources from '../../../../content/content.json';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../../shared/src/constants/i18n';

i18next.use(initReactI18next).init({
  lng: 'en',
  supportedLngs: LANGUAGE_TAGS,
  fallbackLng: DEFAULT_LANGUAGE_TAG,
  resources,
});

export default i18next;
