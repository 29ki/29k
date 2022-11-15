import 'intl-pluralrules';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {findBestAvailableLanguage} from 'react-native-localize';
import dayjs from 'dayjs';
import 'dayjs/locale/pt';
import 'dayjs/locale/sv';

import content from '../../../../content/content.json';
import {
  CLIENT_LANGUAGE_TAGS,
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../../shared/src/constants/i18n';

export * from '../../../../shared/src/constants/i18n';

export const init = () =>
  i18next.use(initReactI18next).init({
    lng: findBestAvailableLanguage(CLIENT_LANGUAGE_TAGS)?.languageTag,
    supportedLngs: LANGUAGE_TAGS,
    fallbackLng: DEFAULT_LANGUAGE_TAG,
    resources: content.i18n,
  });

i18next.on('languageChanged', dayjs.locale);

export default i18next;
