import {BackendModule, ReadCallback} from 'i18next';
import content from '../../../../../content/content.json';
import {LANGUAGE_TAG} from '../../../../../shared/src/i18n/constants';
import {
  filterPublishedContent,
  filterHiddenContent,
} from '../../../../../shared/src/i18n/utils';
import {getShowHiddenContent} from '../utils/utils';
import {
  HIDEABLE_NAMESPACES,
  PUBLISHABLE_NAMESPACES,
} from '../../../../../shared/src/content/constants';
import {I18nNamespace} from '../../../../../shared/src/content/types';

const Backend: BackendModule = {
  type: 'backend',
  init: function () {},
  // Loads all non included content
  read: function (
    language: LANGUAGE_TAG,
    namespace: I18nNamespace,
    callback: ReadCallback,
  ) {
    let namespaceContent = content.i18n[language][namespace];

    if (PUBLISHABLE_NAMESPACES.includes(namespace)) {
      namespaceContent = filterPublishedContent(namespaceContent);
    }

    if (HIDEABLE_NAMESPACES.includes(namespace) && !getShowHiddenContent()) {
      namespaceContent = filterHiddenContent(namespaceContent);
    }

    callback(null, namespaceContent);
  },
};

export default Backend;
