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
import {
  removeHiddenContent,
  removeUnpublishedContent,
} from '../../../shared/src/i18n/utils';

export * from '../../../shared/src/constants/i18n';
export type {i18n as I18nInterface} from 'i18next';

dayjs.extend(localizedFormat);

const resources = removeHiddenContent(removeUnpublishedContent(content.i18n));

init({
  lng: DEFAULT_LANGUAGE_TAG,
  supportedLngs: LANGUAGE_TAGS,
  fallbackLng: DEFAULT_LANGUAGE_TAG,
  resources: resources,
  returnNull: false,
});

export default i18next;
