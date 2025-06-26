import {omitPublishableContent} from './utils';
import content from '../../../../../content/content.json';

jest.mock('../../../../../content/content.json', () => ({
  i18n: {
    en: {categories: {}, collections: {}, tags: {}, exercises: {}, keep: true},
    'pt-PT': {
      categories: {},
      collections: {},
      tags: {},
      exercises: {},
      keep: true,
    },
    sv: {categories: {}, collections: {}, tags: {}, exercises: {}, keep: true},
    ja: {categories: {}, collections: {}, tags: {}, exercises: {}, keep: true},
    da: {categories: {}, collections: {}, tags: {}, exercises: {}, keep: true},
    cs: {categories: {}, collections: {}, tags: {}, exercises: {}, keep: true},
    nl: {categories: {}, collections: {}, tags: {}, exercises: {}, keep: true},
    es: {categories: {}, collections: {}, tags: {}, exercises: {}, keep: true},
  },
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('i18n - utils', () => {
  describe('omitPublishableContent', () => {
    it('should remove publishable content from content', () => {
      expect(omitPublishableContent(content.i18n)).toEqual({
        en: {keep: true},
        'pt-PT': {keep: true},
        sv: {keep: true},
        ja: {keep: true},
        da: {keep: true},
        cs: {keep: true},
        nl: {keep: true},
        es: {keep: true},
      });
    });
  });
});
