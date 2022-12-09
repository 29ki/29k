import {omitExercises} from './utils';
import content from '../../../../../content/content.json';

jest.mock('../../../../../content/content.json', () => ({
  i18n: {
    en: {exercises: {}, keep: true},
    pt: {exercises: {}, keep: true},
    sv: {exercises: {}, keep: true},
    es: {exercises: {}, keep: true},
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('i18n - utils', () => {
  describe('omitExercises', () => {
    it('should remove exercises from content', () => {
      expect(omitExercises(content.i18n)).toEqual({
        en: {keep: true},
        pt: {keep: true},
        sv: {keep: true},
        es: {keep: true},
      });
    });
  });
});
