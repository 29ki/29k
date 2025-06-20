import {renderHook} from '@testing-library/react-hooks';
import useAppState from '../../appState/state/state';
import useLanguageFromRoute from './useLanguageFromRoute';
import {useNavigation} from '@react-navigation/native';
import {findBestLanguageTag} from 'react-native-localize';

const mockI18n = {
  changeLanguage: jest.fn(),
};
jest.mock('react-i18next', () => ({
  useTranslation: () => ({i18n: mockI18n}),
}));

const mockNavigation = (useNavigation as jest.Mock)();
const mockAddListener = mockNavigation.addListener as jest.Mock;
const mockGetCurrentRoute = mockNavigation.getCurrentRoute as jest.Mock;

mockAddListener.mockImplementation((event: string, callback: () => {}) => {
  callback();
});

const mockFindBestLanguageTag = findBestLanguageTag as jest.Mock;

mockFindBestLanguageTag.mockImplementation(
  (languageTags: readonly string[]) => ({
    languageTag: languageTags[0],
  }),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useLanguageFromRoute', () => {
  it('listens for language in route params', () => {
    mockGetCurrentRoute.mockReturnValueOnce({
      params: {language: 'sv'},
    });

    renderHook(() => useLanguageFromRoute());

    expect(mockAddListener).toHaveBeenCalledTimes(1);
    expect(mockAddListener).toHaveBeenCalledWith('state', expect.any(Function));

    expect(mockGetCurrentRoute).toHaveBeenCalledTimes(1);

    expect(mockFindBestLanguageTag).toHaveBeenCalledTimes(1);
    expect(mockFindBestLanguageTag).toHaveBeenCalledWith(['sv']);

    expect(useAppState.getState().settings.preferredLanguage).toEqual('sv');
  });

  it('supports a comma separated list of languages', () => {
    mockGetCurrentRoute.mockReturnValueOnce({
      params: {language: 'pt,sv'},
    });

    renderHook(() => useLanguageFromRoute());

    expect(mockFindBestLanguageTag).toHaveBeenCalledTimes(1);
    expect(mockFindBestLanguageTag).toHaveBeenCalledWith(['pt-PT', 'sv']);

    expect(useAppState.getState().settings.preferredLanguage).toEqual('pt-PT');
  });

  it('does nothing if language param is not set', () => {
    mockGetCurrentRoute.mockReturnValueOnce({});

    renderHook(() => useLanguageFromRoute());

    expect(mockFindBestLanguageTag).toHaveBeenCalledTimes(0);
  });
});
