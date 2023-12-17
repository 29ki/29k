import CMS from 'decap-cms-app';
import cloudinary from 'decap-cms-media-library-cloudinary';

import {
  DEFAULT_LANGUAGE_TAG,
  LANGUAGE_TAGS,
} from '../../shared/src/i18n/constants';
import {
  exercises,
  other,
  collections,
  settings,
  tags,
  ui,
  email,
  categories,
} from './collections/collections';
import {Widget as uniqueIdWidget} from './widgets/uniqueIdWidget';
import textTemplates from './editorComponents.ts/textTemplates';
import withStyles from './lib/withStyles';
import ExercisePreview from './previews/Exercise';

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
        cloud_name: 'cupcake-29k',
        api_key: '373696539271219',
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
    collections: [
      categories,
      collections,
      tags,
      exercises,
      ui,
      email,
      other,
      settings,
    ],
  },
});

CMS.registerWidget(uniqueIdWidget);
CMS.registerMediaLibrary(cloudinary);
CMS.registerEditorComponent(textTemplates);

CMS.registerPreviewStyle('./preview.css');
CMS.registerPreviewTemplate(exercises.name, withStyles(ExercisePreview));
