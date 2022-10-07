"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const netlify_cms_app_1 = __importDefault(require("netlify-cms-app"));
const netlify_cms_media_library_cloudinary_1 = __importDefault(require("netlify-cms-media-library-cloudinary"));
const i18n_1 = require("../../shared/src/constants/i18n");
const i18n_2 = require("./lib/i18n");
const uniqueIdWidget_js_1 = require("./widgets/uniqueIdWidget.js");
const exercise_1 = __importDefault(require("./fields/exercise"));
const contributors_1 = __importDefault(require("./fields/contributors"));
const content_json_1 = __importDefault(require("../../content/content.json"));
netlify_cms_app_1.default.init({
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
        logo_url: 'https://static.tildacdn.com/tild3863-3531-4934-a361-343061656664/29k_logo_white.png',
        i18n: {
            structure: 'single_file',
            locales: i18n_1.LANGUAGE_TAGS,
            default_locale: i18n_1.DEFAULT_LANGUAGE_TAG,
        },
        collections: [
            {
                name: 'exercises',
                label: 'Exercises',
                label_singular: 'exercise',
                folder: '/content/src/exercises',
                identifier_field: 'id',
                extension: 'json',
                format: 'json',
                create: true,
                delete: true,
                publish: true,
                summary: '{{fields.name}}',
                slug: '{{id}}',
                editor: {
                    preview: false,
                },
                fields: exercise_1.default,
                i18n: true,
            },
            (0, i18n_2.generateFilesCollectionFromi18nFiles)('ui', 'UI', content_json_1.default.i18n),
            {
                name: 'other',
                label: 'Other',
                files: [
                    {
                        label: 'All Contributors',
                        name: '.all-contributorsrc',
                        file: '/.all-contributorsrc',
                        fields: contributors_1.default,
                    },
                ],
                i18n: false,
                extension: 'json',
                format: 'json',
                create: false,
                delete: false,
                publish: true,
                identifier_field: 'label',
                editor: {
                    preview: false,
                },
            },
        ],
    },
});
netlify_cms_app_1.default.registerWidget(uniqueIdWidget_js_1.Widget);
netlify_cms_app_1.default.registerMediaLibrary(netlify_cms_media_library_cloudinary_1.default);
//# sourceMappingURL=index.js.map