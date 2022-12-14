import {act, renderHook} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import {Alert as AlertMock} from 'react-native';
import useAppState from '../../appState/state/state';
import useSetPreferedLanguage from './useSetPreferedLanguage';

const alertConfirmMock = AlertMock.alert as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSetPreferedLanguage', () => {
  const {t} = useTranslation();
  (t as unknown as jest.Mock).mockReturnValue('Some translation');

  it('shows a confirm dialogue', async () => {
    const {result} = renderHook(() => useSetPreferedLanguage());

    await act(() => result.current('sv'));

    expect(alertConfirmMock).toHaveBeenCalledTimes(1);
    expect(alertConfirmMock).toHaveBeenCalledWith(
      'Some translation',
      'Some translation',
      [
        {
          text: 'Some translation',
          onPress: expect.any(Function),
          style: 'cancel',
        },
        {text: 'Some translation', onPress: expect.any(Function)},
      ],
    );
  });

  it('sets preferredLanguage appState on confirm', async () => {
    alertConfirmMock.mockImplementationOnce((header, text, config) => {
      // Run the confirm action
      config[1].onPress();
    });

    const {result} = renderHook(() => useSetPreferedLanguage());

    expect(useAppState.getState().settings.preferredLanguage).toBe(undefined);

    await act(() => result.current('sv'));

    expect(alertConfirmMock).toHaveBeenCalledTimes(1);
    expect(useAppState.getState().settings.preferredLanguage).toBe('sv');
  });

  it('does nothing on dismiss', async () => {
    alertConfirmMock.mockImplementationOnce((header, text, config) => {
      // Run the dismiss action
      config[0].onPress();
    });

    const {result} = renderHook(() => useSetPreferedLanguage());

    expect(useAppState.getState().settings.preferredLanguage).toBe(undefined);

    await act(() => result.current('sv'));

    expect(alertConfirmMock).toHaveBeenCalledTimes(1);
    expect(useAppState.getState().settings.preferredLanguage).toBe(undefined);
  });
});
