import useAppState from '../../appState/state/state';
import Backend from './backend';

jest.mock('../../../../../content/content.json', () => ({
  i18n: {
    en: {exercises: {'exercise-1': {hidden: true}, 'exercise-2': {}}},
  },
}));

jest.mock('../../appState/state/state');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('i18n - backend', () => {
  it('should only set non hidden exercises as default', () => {
    (useAppState.getState as jest.Mock).mockReturnValueOnce({
      showHiddenContent: false,
    });
    const callbackMock = jest.fn();
    Backend.read('en', 'exercises', callbackMock);

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith(null, {'exercise-2': {}});
  });

  it('should only set also hidden exercises', () => {
    (useAppState.getState as jest.Mock).mockReturnValueOnce({
      showHiddenContent: true,
    });
    const callbackMock = jest.fn();
    Backend.read('en', 'exercises', callbackMock);

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith(null, {
      'exercise-1': {hidden: true},
      'exercise-2': {},
    });
  });

  it('should handle other namespaces', () => {
    (useAppState.getState as jest.Mock).mockReturnValueOnce({
      showHiddenContent: true,
    });
    const callbackMock = jest.fn();
    Backend.read('en', 'translations', callbackMock);

    expect(callbackMock).toHaveBeenCalledTimes(1);
    expect(callbackMock).toHaveBeenCalledWith(null, undefined);
  });
});
