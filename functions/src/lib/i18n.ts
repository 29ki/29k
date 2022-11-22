import i18next, {init} from 'i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/en-gb';
import 'dayjs/locale/pt';
import 'dayjs/locale/sv';
import 'dayjs/locale/es';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import content from '../../../content/content.json';
import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../../shared/src/constants/i18n';

export * from '../../../shared/src/constants/i18n';
export type {i18n as I18nInterface} from 'i18next';

dayjs.extend(localizedFormat);

init({
  lng: DEFAULT_LANGUAGE_TAG,
  supportedLngs: LANGUAGE_TAGS,
  fallbackLng: DEFAULT_LANGUAGE_TAG,
  resources: content.i18n,
});

export default i18next;
