import {mergeDeepWith} from 'ramda';
import {generateI18NResources, mergeWithArrays} from './utils';

describe('utils', () => {
  describe('generateI18NResources', () => {
    it('should key content on i18n resource', () => {
      const content = {
        Component: {
          en: {
            translationKey: 'some text',
          },
          sv: {
            translationKey: 'some translation',
          },
          pt: {
            translationKey: 'some other translation',
          },
          ja: {
            translationKey: 'some other translation',
          },
          da: {
            translationKey: 'some other translation',
          },
          cs: {
            translationKey: 'some other translation',
          },
          nl: {
            translationKey: 'some other translation',
          },
          es: {
            translationKey: 'some other translation',
          },
        },
      };
      expect(generateI18NResources(content)).toEqual({
        en: {
          Component: {
            translationKey: 'some text',
          },
        },
        sv: {
          Component: {
            translationKey: 'some translation',
          },
        },
        pt: {
          Component: {
            translationKey: 'some other translation',
          },
        },
        ja: {
          Component: {
            translationKey: 'some other translation',
          },
        },
        da: {
          Component: {
            translationKey: 'some other translation',
          },
        },
        cs: {
          Component: {
            translationKey: 'some other translation',
          },
        },
        nl: {
          Component: {
            translationKey: 'some other translation',
          },
        },
        es: {
          Component: {
            translationKey: 'some other translation',
          },
        },
      });
    });

    it('should add exercies and key content on language', () => {
      const content = {
        'some-exercise-id': {
          en: {
            id: 'some-exercise-id',
            name: 'You body, your home',
            slides: [
              {
                type: 'participantSpotlight',
              },
            ],
            published: true,
          },
          sv: {published: false},
          pt: {published: false},
          ja: {published: false},
          da: {published: false},
          cs: {published: false},
          nl: {published: false},
          es: {published: false},
        },
        'some-other-exercise-id': {
          en: {
            id: 'some-other-exercise-id',
            name: 'You body, your home',
            slides: [
              {
                type: 'participantSpotlight',
              },
            ],
            published: true,
          },
          sv: {published: false},
          pt: {published: false},
          ja: {published: false},
          da: {published: false},
          cs: {published: false},
          nl: {published: false},
          es: {published: false},
        },
      };
      expect(generateI18NResources(content, 'exercises')).toEqual({
        en: {
          exercises: {
            'some-exercise-id': content['some-exercise-id']['en'],
            'some-other-exercise-id': content['some-other-exercise-id']['en'],
          },
        },
        sv: {
          exercises: {
            'some-exercise-id': {published: false},
            'some-other-exercise-id': {published: false},
          },
        },
        pt: {
          exercises: {
            'some-exercise-id': {published: false},
            'some-other-exercise-id': {published: false},
          },
        },
        ja: {
          exercises: {
            'some-exercise-id': {published: false},
            'some-other-exercise-id': {published: false},
          },
        },
        da: {
          exercises: {
            'some-exercise-id': {published: false},
            'some-other-exercise-id': {published: false},
          },
        },
        cs: {
          exercises: {
            'some-exercise-id': {published: false},
            'some-other-exercise-id': {published: false},
          },
        },
        nl: {
          exercises: {
            'some-exercise-id': {published: false},
            'some-other-exercise-id': {published: false},
          },
        },
        es: {
          exercises: {
            'some-exercise-id': {published: false},
            'some-other-exercise-id': {published: false},
          },
        },
      });
    });
  });

  describe('mergeWithArrays', () => {
    it('supports deep merging arrays', () => {
      const a = {
        foo: [1, 2],
      };
      const b = {
        foo: [5, 6, 3, 4],
      };
      expect(mergeDeepWith(mergeWithArrays, a, b)).toEqual({
        foo: [1, 2, 3, 4],
      });
    });

    it('merges even if array A is longer than B', () => {
      const a = {
        foo: [1, 2, 3, 4],
      };
      const b = {
        foo: [5, 6],
      };
      expect(mergeDeepWith(mergeWithArrays, a, b)).toEqual({
        foo: [1, 2, 3, 4],
      });
    });

    it('disregards array nil values', () => {
      const a = {
        foo: [null, 5, undefined, 6],
      };
      const b = {
        foo: [1, 2, 3, 4],
      };
      expect(mergeDeepWith(mergeWithArrays, a, b)).toEqual({
        foo: [1, 5, 3, 6],
      });
    });

    it('deep merges objects in arrays', () => {
      const a = {
        foo: [{bar: 1}, {bar: 2}],
      };
      const b = {
        foo: [{baz: 3}, {baz: 4}],
      };
      expect(mergeDeepWith(mergeWithArrays, a, b)).toEqual({
        foo: [
          {bar: 1, baz: 3},
          {bar: 2, baz: 4},
        ],
      });
    });
  });
});
