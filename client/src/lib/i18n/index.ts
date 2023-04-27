import 'intl-pluralrules';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import {
  findBestAvailableLanguage,
  uses24HourClock,
} from 'react-native-localize';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/pt';
import 'dayjs/locale/sv';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import content from '../../../../content/content.json';
import {
  CLIENT_LANGUAGE_TAGS,
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../../shared/src/constants/i18n';
import Backend from './backend/backend';
import {omitExercisesAndCollections} from './utils/utils';

export * from '../../../../shared/src/constants/i18n';

dayjs.extend(localizedFormat);

const DEFAULT_24HOUR_LANGUAGE_TAG = 'en-gb';

export const init = () =>
  i18next
    .use(Backend)
    .use(initReactI18next)
    .init({
      lng: findBestAvailableLanguage(CLIENT_LANGUAGE_TAGS)?.languageTag,
      supportedLngs: LANGUAGE_TAGS,
      fallbackLng: DEFAULT_LANGUAGE_TAG,
      // To trigger the backend middleware to load exercises they have to be removed first.
      // Removing them in buildContent creates somewhat of a mess in backend adding them back.
      resources: omitExercisesAndCollections(content.i18n),
      partialBundledLanguages: true,
      returnNull: false,
      interpolation: {
        escapeValue: false, // react already safes from xss
      },
    });

i18next.on('languageChanged', languageTag => {
  dayjs.locale(
    languageTag === DEFAULT_LANGUAGE_TAG
      ? // Since DEFAULT_LOCALE is our fallback we need to take 24 hour clock into account
        uses24HourClock()
        ? DEFAULT_24HOUR_LANGUAGE_TAG
        : DEFAULT_LANGUAGE_TAG
      : languageTag,
  );
});

export default i18next;
