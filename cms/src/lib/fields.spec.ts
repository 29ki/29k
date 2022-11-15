import {CmsField} from 'netlify-cms-core';
import {JSONObject} from '../../../shared/src/types/JSON';
import {applyDefaults} from './fields';

const defaults: JSONObject = {
  foo: {
    bar: {
      baz: 'meow?',
    },
  },
  quux: true,
};

const fields: CmsField[] = [
  {
    widget: 'object',
    name: 'foo',
    fields: [
      {
        widget: 'object',
        name: 'bar',
        fields: [
          {
            widget: 'string',
            name: 'baz',
          },
        ],
      },
    ],
  },
  {
    widget: 'boolean',
    name: 'quux',
  },
];

describe('applyDefaults', () => {
  it('applies defaults to a nested CMSField structure', () => {
    expect(applyDefaults(fields, defaults)).toEqual([
      {
        default: {
          bar: {
            baz: 'meow?',
          },
        },
        fields: [
          {
            default: {
              baz: 'meow?',
            },
            fields: [
              {
                default: 'meow?',
                name: 'baz',
                widget: 'string',
              },
            ],
            name: 'bar',
            widget: 'object',
          },
        ],
        name: 'foo',
        widget: 'object',
      },
      {
        default: true,
        widget: 'boolean',
        name: 'quux',
      },
    ]);
  });

  it('works with undefined defaults', () => {
    expect(applyDefaults(fields)).toEqual([
      {
        fields: [
          {
            fields: [
              {
                name: 'baz',
                widget: 'string',
              },
            ],
            name: 'bar',
            widget: 'object',
          },
        ],
        name: 'foo',
        widget: 'object',
      },
      {
        widget: 'boolean',
        name: 'quux',
      },
    ]);
  });
});
