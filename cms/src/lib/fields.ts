import {CmsField} from 'netlify-cms-core';
import {JSONObject} from '../../../shared/src/types/JSON';

// This applies field defaults to nested CMSField structures as you have to specify them individually per field
export const applyDefaults: (
  fields: Array<CmsField>,
  defaults: JSONObject,
) => CmsField[] = (fields, defaults = {}) =>
  fields.map(field => {
    const fieldDefault = defaults[field.name];

    let overrides = {};

    if (
      field.widget === 'object' &&
      'fields' in field &&
      typeof fieldDefault === 'object' &&
      !Array.isArray(fieldDefault)
    ) {
      overrides = {
        ...overrides,
        fields: applyDefaults(field.fields, fieldDefault),
      };
    }

    if (fieldDefault) {
      overrides = {
        ...overrides,
        default: fieldDefault,
      };
    }

    return {
      ...field,
      ...overrides,
    };
  });
