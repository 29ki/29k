import CMS from 'netlify-cms-app';

import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../shared/src/constants/i18n';

import {generateFilesCollectionFromi18nFiles} from './lib/i18n';
import content from '../../content/content.json';

CMS.init({
  config: {
    load_config_file: false,
    backend: {
      name: 'github',
      repo: '29ki/29k',
      branch: 'main',
      open_authoring: true,
    },
    local_backend: {
      url: 'http://localhost:1337/api/v1',
    },
    publish_mode: 'editorial_workflow',
    media_folder: 'media',
    logo_url:
      'https://static.tildacdn.com/tild3863-3531-4934-a361-343061656664/29k_logo_white.png',
    i18n: {
      structure: 'single_file',
      locales: LANGUAGE_TAGS,
      default_locale: DEFAULT_LANGUAGE_TAG,
    },
    collections: [generateFilesCollectionFromi18nFiles('ui', 'UI', content)],
  },
});
