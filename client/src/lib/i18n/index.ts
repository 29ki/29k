import 'intl-pluralrules';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {findBestAvailableLanguage} from 'react-native-localize';

import resources from '../../../../content/content.json';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../../shared/src/constants/i18n';

export const init = async () => {
  i18next.use(initReactI18next).init({
    lng: findBestAvailableLanguage(LANGUAGE_TAGS)?.languageTag,
    supportedLngs: LANGUAGE_TAGS,
    fallbackLng: DEFAULT_LANGUAGE_TAG,
    resources,
  });
};

export default i18next;
