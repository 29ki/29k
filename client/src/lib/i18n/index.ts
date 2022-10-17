import 'intl-pluralrules';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {findBestAvailableLanguage} from 'react-native-localize';
import dayjs from 'dayjs';
import 'dayjs/locale/pt';
import 'dayjs/locale/sv';

import content from '../../../../content/content.json';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../../shared/src/constants/i18n';

export * from '../../../../shared/src/constants/i18n';

export const init = () => {
  dayjs.locale(findBestAvailableLanguage(LANGUAGE_TAGS)?.languageTag);
  i18next.use(initReactI18next).init({
    lng: findBestAvailableLanguage(LANGUAGE_TAGS)?.languageTag,
    supportedLngs: LANGUAGE_TAGS,
    fallbackLng: DEFAULT_LANGUAGE_TAG,
    resources: content.i18n,
  });
};

export default i18next;
