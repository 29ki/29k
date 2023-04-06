// https://github.com/netlify/netlify-cms/pull/3366#issuecomment-662033144
// https://github.com/reimertz/netlify-cms/commit/8ebe03a08e4aaab8fa038caf226dd425c8e7b1b2

import {CmsCollection, CmsField} from 'netlify-cms-core';
import {Resource, ResourceKey, ResourceLanguage} from 'i18next';
import {DEFAULT_LANGUAGE_TAG} from '../../../shared/src/constants/i18n';

const SUPPORTED_KEYBASED_WIDGETS = [
  'date',
  'datetime',
  'markdown',
  'string',
  'text',
  'number',
  'image',
  'file',
];

/*
getFieldWidgetType

a helper for our auto-generated i18n fields by
adding support to specify widgettype by appending __WIDGETTYPE to the key,

Example:

{
  courseName: "A Course",
  courseDescription__markdown: '## This is markdown and thanks to specyfying the widget type, our cms will pick up what widget to use.'
  courseDescription__markdown_context: '## Another markdown widget type
}

*/
const getFieldWidgetType = (key = '') => {
  const parsedWidgetType = key.split('__')[1] || '';
  const cleanWidgetType = parsedWidgetType.split('_')[0]; // remove context
  if (cleanWidgetType && SUPPORTED_KEYBASED_WIDGETS.includes(cleanWidgetType))
    return cleanWidgetType;
  else return 'string';
};

export const generateFieldFromI18n = ([key, value]: [
  string,
  ResourceKey,
]): CmsField => {
  if (Array.isArray(value)) {
    return {
      label: key,
      name: key,
      widget: 'list',
      required: true,
      ...(Object.entries(value).every(([, val]) => typeof val === 'string')
        ? {
            // Plain string fields
            field: {
              label: key.slice(0, -1),
              name: key.slice(0, -1),
              required: true,
              widget: 'string',
              i18n: true,
            } as CmsField,
          }
        : {
            // Create fields based on object shapes
            fields: Object.entries(value[0] as ResourceKey).map(
              generateFieldFromI18n,
            ),
          }),
      i18n: true,
    } as CmsField;
  } else if (typeof value === 'object') {
    return {
      label: key,
      name: key,
      widget: 'object',
      required: true,
      fields: Object.entries(value).map(generateFieldFromI18n),
      i18n: true,
    } as CmsField;
  } else {
    const widget = getFieldWidgetType(key);
    return {
      label: key,
      name: key,
      required: false,
      widget,
      i18n: true,
      minimal: true,
    } as CmsField;
  }
};

export const generateFilesCollectionFromi18nFiles = (
  folderName: string,
  label: string,
  i18nResources: Resource,
  excludeFn: (resource: [string, ResourceKey]) => boolean,
): CmsCollection => {
  const filteredResources = Object.entries(
    i18nResources[DEFAULT_LANGUAGE_TAG],
  ).filter(excludeFn);

  return {
    label,
    name: folderName,
    i18n: true,
    files: filteredResources.map(([namespace, resources]) => ({
      file: `/content/src/${folderName}/${namespace}.json`,
      name: namespace,
      label: namespace,
      fields: Object.entries(resources).map(generateFieldFromI18n),
      i18n: true,
    })),
    editor: {
      preview: false,
    },
    format: 'json',
    create: false,
    delete: false,
    publish: true,
    summary: '{{filename}}',
  };
};
