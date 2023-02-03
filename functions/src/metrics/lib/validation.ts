import {mixed} from 'yup';

export const property = () =>
  mixed().test(
    'invalid-property',
    ({originalValue}) => `invalid property type: ${typeof originalValue}`,
    value => {
      switch (typeof value) {
        case 'boolean':
        case 'number':
        case 'string':
          return true;
        default:
          return false;
      }
    },
  );

export const properties = () =>
  mixed()
    .test(
      'invalid-properties',
      'invalid properties type',
      properties =>
        properties === undefined ||
        (typeof properties === 'object' &&
          !Array.isArray(properties) &&
          properties !== null),
    )
    .test(
      'invalid-properties',
      'contains invalid property types',
      properties =>
        properties === undefined ||
        Object.values(properties).every(value => property().isValidSync(value)),
    );
