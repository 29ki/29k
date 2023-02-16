import {properties, property} from './validation';

const propertySchema = property();
const propertiesSchema = properties();

describe('property', () => {
  it('accepts a boolean', () => {
    expect(propertySchema.validateSync(true)).toBe(true);
  });

  it('accepts a number', () => {
    expect(propertySchema.validateSync(1)).toBe(1);
  });

  it('accepts a string', () => {
    expect(propertySchema.validateSync('string')).toBe('string');
  });

  it('throws on unknown types', () => {
    expect(() => propertySchema.validateSync({foo: 'bar'})).toThrow(
      'invalid property type: object',
    );
  });
});

describe('properties', () => {
  it('accepts a dynamic object', () => {
    expect(
      propertiesSchema.validateSync({
        boolean: true,
        number: 1,
        string: 'string',
      }),
    ).toEqual({
      boolean: true,
      number: 1,
      string: 'string',
    });
  });

  it('accepts undefined', () => {
    expect(propertiesSchema.validateSync(undefined)).toEqual(undefined);
  });

  it('throws on null', () => {
    expect(() => propertiesSchema.validateSync(null)).toThrow(
      'this cannot be null',
    );
  });

  it('throws on array', () => {
    expect(() => propertiesSchema.validateSync([])).toThrow(
      'invalid properties type',
    );
  });

  it('throws on unkown types', () => {
    expect(() => propertiesSchema.validateSync('string')).toThrow(
      'invalid properties type',
    );
  });

  it('throws on unknown property types', () => {
    expect(() =>
      propertiesSchema.validateSync({
        object: {foo: 'bar'},
      }),
    ).toThrow('contains invalid property types');
  });
});
