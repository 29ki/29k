import {filterPublishedContent, generateI18NResources} from './utils.js';

describe('utils', () => {
  describe('generateI18NResources', () => {
    it('should key content on i18n resource', () => {
      const content = {
        en: {
          translationKey: 'some text',
        },
        sv: {
          translationKey: 'some translation',
        },
      };
      expect(generateI18NResources(content)).toEqual({
        translationKey: {en: 'some text', sv: 'some translation'},
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
        },
      };
      expect(generateI18NResources(content, 'exercises')).toEqual({
        en: {
          exercises: {'some-exercise-id': content['some-exercise-id']['en']},
        },
      });
    });
  });

  describe('filterPublishedContent', () => {
    it('should filter out non published content', () => {
      const content = {
        'some-exercise-id': {
          en: {
            id: 'some-exercise-id',
            name: 'You body, your home',
            slides: [],
            published: true,
          },
          sv: {id: 'some-exercise-id', published: false},
          pt: {id: 'some-exercise-id', published: false},
        },
      };

      expect(filterPublishedContent(content)).toEqual({
        'some-exercise-id': {
          en: {
            id: 'some-exercise-id',
            name: 'You body, your home',
            slides: [],
            published: true,
          },
        },
      });
    });
  });
});
