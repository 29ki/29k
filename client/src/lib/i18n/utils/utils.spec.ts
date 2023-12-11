import {omitUnpublishedContent} from './utils';
import content from '../../../../../content/content.json';

jest.mock('../../../../../content/content.json', () => ({
  i18n: {
    en: {categories: {}, collections: {}, tags: {}, exercises: {}, keep: true},
    pt: {categories: {}, collections: {}, tags: {}, exercises: {}, keep: true},
    sv: {categories: {}, collections: {}, tags: {}, exercises: {}, keep: true},
    ja: {categories: {}, collections: {}, tags: {}, exercises: {}, keep: true},
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('i18n - utils', () => {
  describe('omitUnpublishedContent', () => {
    it('should remove publishable content from content', () => {
      expect(omitUnpublishedContent(content.i18n)).toEqual({
        en: {keep: true},
        pt: {keep: true},
        sv: {keep: true},
        ja: {keep: true},
      });
    });
  });
});
