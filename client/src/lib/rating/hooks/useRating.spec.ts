import {act, renderHook} from '@testing-library/react-hooks';
import useAppState, {APP_RATING_REVISION} from '../../appState/state/state';
import useRating from './useRating';

import {useTranslation} from 'react-i18next';

// TODO remove when iOS app goes live
jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native');
  reactNative.Platform.OS = 'android';
  reactNative.Alert.alert = jest.fn();
  return reactNative;
});

import {Alert as AlertMock} from 'react-native';

const alertConfirmMock = AlertMock.alert as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useRating', () => {
  const {t} = useTranslation();
  (t as unknown as jest.Mock).mockReturnValue('Some translation');

  it('should ask for rating if not already given', () => {
    useAppState.setState({
      settings: {
        appRatedRevision: APP_RATING_REVISION - 1,
        showOnboarding: true,
        showHiddenContent: false,
      },
    });

    const {result} = renderHook(() => useRating());

    act(() => {
      const res = result.current();
      expect(res).toBe(true);
      expect(alertConfirmMock).toHaveBeenCalledTimes(1);
      expect(alertConfirmMock).toHaveBeenCalledWith(
        'Some translation',
        'Some translation',
        [
          {
            onPress: expect.any(Function),
            style: 'cancel',
            text: 'Some translation',
          },
          {
            onPress: expect.any(Function),
            style: 'default',
            text: 'Some translation',
          },
        ],
      );
    });
  });

  it('should not ask for rating if already given', () => {
    useAppState.setState({
      settings: {
        appRatedRevision: APP_RATING_REVISION,
        showOnboarding: true,
        showHiddenContent: false,
      },
    });

    const {result} = renderHook(() => useRating());

    act(() => {
      expect(result.current()).toBe(false);
      expect(alertConfirmMock).toHaveBeenCalledTimes(0);
    });
  });
});
