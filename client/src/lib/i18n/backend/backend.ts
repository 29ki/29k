import {BackendModule, ReadCallback} from 'i18next';
import content from '../../../../../content/content.json';
import {
  LANGUAGE_TAG,
  DEFAULT_LANGUAGE_TAG,
} from '../../../../../shared/src/constants/i18n';
import {
  filterPublishedContent,
  filterHiddenContent,
} from '../../../../../shared/src/i18n/utils';
import {getShowHiddenContent} from '../utils/utils';

type Namespace = keyof (typeof content.i18n)[typeof DEFAULT_LANGUAGE_TAG];

const Backend: BackendModule = {
  type: 'backend',
  init: function () {},
  // Loads all non included content
  read: function (
    language: LANGUAGE_TAG,
    namespace: Namespace | 'exercises' | 'collections',
    callback: ReadCallback,
  ) {
    if (namespace === 'exercises' || namespace === 'collections') {
      const namespaceContent = filterPublishedContent(
        content.i18n[language][namespace],
      );

      if (getShowHiddenContent()) {
        callback(null, namespaceContent);
      } else {
        // Default load only non hidden
        callback(null, filterHiddenContent(namespaceContent));
      }
    } else {
      callback(null, content.i18n[language][namespace]);
    }
  },
};

export default Backend;
