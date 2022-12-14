import {renderHook} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import {Alert as AlertMock} from 'react-native';
import auth from '@react-native-firebase/auth';
import useDeleteUser from './useDeleteUser';

const alertConfirmMock = AlertMock.alert as jest.Mock;

const mockResetSessionState = jest.fn();
jest.mock('../../appState/state/state', () =>
  jest.fn(fn => fn({reset: mockResetSessionState})),
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useDeleteUser', () => {
  const {t} = useTranslation();
  (t as unknown as jest.Mock).mockReturnValue('Some translation');

  it('shows a confirm dialogue', async () => {
    const {result} = renderHook(() => useDeleteUser());

    result.current();

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

  it('deletes user and resets appState on confirm', async () => {
    alertConfirmMock.mockImplementationOnce((header, text, config) => {
      // Run the confirm action
      config[1].onPress();
    });

    const {result} = renderHook(() => useDeleteUser());

    expect(await result.current()).toBe(true);
    expect(alertConfirmMock).toHaveBeenCalledTimes(1);
    expect(auth().currentUser?.delete).toHaveBeenCalledTimes(1);
    expect(mockResetSessionState).toHaveBeenCalledTimes(1);
  });

  it('does nothing on dismiss', async () => {
    alertConfirmMock.mockImplementationOnce((header, text, config) => {
      // Run the dismiss action
      config[0].onPress();
    });

    const {result} = renderHook(() => useDeleteUser());

    expect(await result.current()).toBe(false);
    expect(alertConfirmMock).toHaveBeenCalledTimes(1);
    expect(auth().currentUser?.delete).toHaveBeenCalledTimes(0);
    expect(mockResetSessionState).toHaveBeenCalledTimes(0);
  });
});
