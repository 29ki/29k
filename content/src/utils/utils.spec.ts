import {generateI18NResources} from './utils';

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
      });
    });
  });
});
