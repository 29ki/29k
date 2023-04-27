import {omitExercisesAndCollections} from './utils';
import content from '../../../../../content/content.json';

jest.mock('../../../../../content/content.json', () => ({
  i18n: {
    en: {exercises: {}, collections: {}, keep: true},
    pt: {exercises: {}, collections: {}, keep: true},
    sv: {exercises: {}, collections: {}, keep: true},
    es: {exercises: {}, collections: {}, keep: true},
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('i18n - utils', () => {
  describe('omitExercisesAndCollections', () => {
    it('should remove exercises from content', () => {
      expect(omitExercisesAndCollections(content.i18n)).toEqual({
        en: {keep: true},
        pt: {keep: true},
        sv: {keep: true},
        es: {keep: true},
      });
    });
  });
});
