import useAppState from '../../appState/state/state';
import Backend from './backend';

jest.mock('../../../../../content/content.json', () => ({
  i18n: {
    en: {
      exercises: {
        'exercise-1': {published: true, hidden: true},
        'exercise-2': {published: true},
        'exercise-3': {published: false},
      },
      collections: {
        'collection-1': {published: true, hidden: true},
        'collection-2': {published: true},
        'collection-3': {published: false},
      },
    },
    es: {},
  },
}));

jest.mock('../../appState/state/state');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('i18n - backend', () => {
  describe('exercises', () => {
    it('should only set published and non hidden exercises as default', () => {
      (useAppState.getState as jest.Mock).mockReturnValueOnce({
        settings: {
          showHiddenContent: false,
        },
      });
      const callbackMock = jest.fn();
      Backend.read('en', 'exercises', callbackMock);

      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(null, {
        'exercise-2': {published: true},
      });
    });

    it('should set published and hidden exercises', () => {
      (useAppState.getState as jest.Mock).mockReturnValueOnce({
        settings: {
          showHiddenContent: true,
        },
      });
      const callbackMock = jest.fn();
      Backend.read('en', 'exercises', callbackMock);

      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(null, {
        'exercise-1': {hidden: true, published: true},
        'exercise-2': {published: true},
      });
    });

    it('should handle other namespaces', () => {
      (useAppState.getState as jest.Mock).mockReturnValueOnce({
        settings: {
          showHiddenContent: true,
        },
      });
      const callbackMock = jest.fn();
      Backend.read('en', 'translations', callbackMock);

      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(null, undefined);
    });
  });

  describe('collections', () => {
    it('should only set published and non hidden collections as default', () => {
      (useAppState.getState as jest.Mock).mockReturnValueOnce({
        settings: {
          showHiddenContent: false,
        },
      });
      const callbackMock = jest.fn();
      Backend.read('en', 'collections', callbackMock);

      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(null, {
        'collection-2': {published: true},
      });
    });

    it('should set published and hidden collections', () => {
      (useAppState.getState as jest.Mock).mockReturnValueOnce({
        settings: {
          showHiddenContent: true,
        },
      });
      const callbackMock = jest.fn();
      Backend.read('en', 'collections', callbackMock);

      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(null, {
        'collection-1': {hidden: true, published: true},
        'collection-2': {published: true},
      });
    });

    it('should handle other namespaces', () => {
      (useAppState.getState as jest.Mock).mockReturnValueOnce({
        settings: {
          showHiddenContent: true,
        },
      });
      const callbackMock = jest.fn();
      Backend.read('en', 'translations', callbackMock);

      expect(callbackMock).toHaveBeenCalledTimes(1);
      expect(callbackMock).toHaveBeenCalledWith(null, undefined);
    });
  });
});
