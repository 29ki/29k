import CMS from 'netlify-cms-app';
import cloudinary from 'netlify-cms-media-library-cloudinary';

import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../shared/src/constants/i18n';
import {exercises, contributors, files} from './collections/collections';
import {Widget as uniqueIdWidget} from './widgets/uniqueIdWidget';

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
    media_library: {
      name: 'cloudinary',
      config: {
        cloud_name: 'twentyninek',
        api_key: '898446174989532',
        default_transformations: [
          [
            {
              transformation: 'global',
              quality: 'auto',
            },
          ],
        ],
      },
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
    collections: [exercises, contributors, files],
  },
});

CMS.registerWidget(uniqueIdWidget);
CMS.registerMediaLibrary(cloudinary);
