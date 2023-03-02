import {renderHook} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import {Alert as AlertMock} from 'react-native';
import auth from '@react-native-firebase/auth';
import useSignOutUser from './useSignOutUser';
import {act} from 'react-test-renderer';

const alertConfirmMock = AlertMock.alert as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSignOutUser', () => {
  const {t} = useTranslation();
  (t as unknown as jest.Mock).mockReturnValue('Some translation');

  it('shows a confirm dialogue', async () => {
    const {result} = renderHook(() => useSignOutUser());

    act(() => {
      result.current();
    });

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
        {
          text: 'Some translation',
          style: 'destructive',
          onPress: expect.any(Function),
        },
      ],
    );
  });

  it('sings out the user on confirm', async () => {
    alertConfirmMock.mockImplementationOnce((header, text, config) => {
      // Run the confirm action
      config[1].onPress();
    });

    const {result} = renderHook(() => useSignOutUser());

    await act(async () => {
      expect(await result.current()).toBe(true);
    });

    expect(alertConfirmMock).toHaveBeenCalledTimes(1);
    expect(auth().signOut).toHaveBeenCalledTimes(1);
  });

  it('does nothing on dismiss', async () => {
    alertConfirmMock.mockImplementationOnce((header, text, config) => {
      // Run the dismiss action
      config[0].onPress();
    });

    const {result} = renderHook(() => useSignOutUser());

    await act(async () => {
      expect(await result.current()).toBe(false);
    });

    expect(alertConfirmMock).toHaveBeenCalledTimes(1);
    expect(auth().currentUser?.delete).toHaveBeenCalledTimes(0);
  });
});
