import {
  removeHiddenContent,
  filterHiddenContent,
  removeUnpublishedContent,
  filterPublishedContent,
} from './utils';

describe('utils', () => {
  describe('filterPublishedContent', () => {
    it('should remove hidden content', () => {
      expect(
        filterPublishedContent({
          'exercise-1': {},
          'exercise-2': {published: true},
        }),
      ).toEqual({
        'exercise-2': {published: true},
      });
    });
  });

  describe('filterHiddenContent', () => {
    it('should remove hidden content', () => {
      expect(
        filterHiddenContent({'exercise-1': {}, 'exercise-2': {hidden: true}}),
      ).toEqual({
        'exercise-1': {},
      });
    });
  });

  describe('removeUnpublishedContent', () => {
    it('should remove unpublished content', () => {
      expect(
        removeUnpublishedContent({
          en: {
            exercises: {
              'exercise-1': {published: true},
              'exercise-2': {},
            },
            collections: {
              'collection-1': {published: true},
              'collection-2': {},
            },
          },
          pt: {
            exercises: {
              'exercise-1': {},
              'exercise-2': {published: true},
            },
            collections: {
              'collection-1': {},
              'collection-2': {published: true},
            },
          },
          sv: {exercises: {}, collections: {}},
          es: {exercises: {}, collections: {}},
        }),
      ).toEqual({
        en: {
          exercises: {'exercise-1': {published: true}},
          collections: {'collection-1': {published: true}},
        },
        pt: {
          exercises: {'exercise-2': {published: true}},
          collections: {'collection-2': {published: true}},
        },
        sv: {exercises: {}, collections: {}},
        es: {exercises: {}, collections: {}},
      });
    });
  });

  describe('removeHiddenContent', () => {
    it('should remove hidden exercises from all lanugages', () => {
      expect(
        removeHiddenContent({
          en: {
            exercises: {
              'exercise-1': {},
              'exercise-2': {hidden: true},
            },
            collections: {
              'collection-1': {},
              'collection-2': {hidden: true},
            },
          },
          pt: {
            exercises: {
              'exercise-1': {hidden: true},
              'exercise-2': {},
            },
            collections: {
              'collection-1': {hidden: true},
              'collection-2': {},
            },
          },
          sv: {exercises: {}, collections: {}},
          es: {exercises: {}, collections: {}},
        }),
      ).toEqual({
        en: {
          exercises: {'exercise-1': {}},
          collections: {'collection-1': {}},
        },
        pt: {
          exercises: {'exercise-2': {}},
          collections: {'collection-2': {}},
        },
        sv: {exercises: {}, collections: {}},
        es: {exercises: {}, collections: {}},
      });
    });
  });
});
