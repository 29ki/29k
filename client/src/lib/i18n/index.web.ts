import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/pt';
import 'dayjs/locale/sv';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';

import content from '../../../../content/content.json';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../../shared/src/i18n/constants';
import {removeUnpublishedContent} from '../../../../shared/src/i18n/utils';

export * from '../../../../shared/src/i18n/constants';

dayjs.extend(localizedFormat);
dayjs.extend(utc);

export const init = (language?: LANGUAGE_TAG) =>
  i18next.use(initReactI18next).init({
    lng: language || DEFAULT_LANGUAGE_TAG,
    supportedLngs: LANGUAGE_TAGS,
    fallbackLng: DEFAULT_LANGUAGE_TAG,
    resources: removeUnpublishedContent(content.i18n),

    returnNull: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18next;
