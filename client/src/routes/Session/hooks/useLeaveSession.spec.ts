import {useNavigation} from '@react-navigation/native';
import {act, renderHook} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import {Alert as AlertMock} from 'react-native';
import {useResetRecoilState} from 'recoil';
import {sessionsAtom} from '../../Sessions/state/state';
import {sessionAtom} from '../state/state';
import useLeaveSession from './useLeaveSession';

const alertConfirmMock = AlertMock.alert as jest.Mock;

jest.mock('../DailyProvider', () => ({
  DailyContext: jest.fn(),
}));

const mockLeaveMeeting = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({leaveMeeting: mockLeaveMeeting})),
}));

const mockReseRecoilState = jest.fn();
jest.mock('recoil', () => ({
  ...jest.requireActual('recoil'),
  useResetRecoilState: jest.fn(() => mockReseRecoilState),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useLeaveSession', () => {
  const {t} = useTranslation();
  (t as jest.Mock).mockReturnValue('Some translation');
  const navigation = useNavigation();
  const resetState = useResetRecoilState(sessionsAtom);

  describe('leaveSession', () => {
    it('leaves the call, resets the state and navigates on confirming', async () => {
      const {result} = renderHook(() => useLeaveSession());

      await act(() => result.current.leaveSession());

      expect(mockLeaveMeeting).toHaveBeenCalledTimes(1);
      expect(useResetRecoilState).toHaveBeenCalled(); // Weird recoil caching seems to make this be called twice in this test
      expect(useResetRecoilState).toHaveBeenCalledWith(sessionAtom);
      expect(resetState).toHaveBeenCalledTimes(1);
      expect(navigation.navigate as jest.Mock).toHaveBeenCalledTimes(1);
    });
  });

  describe('leaveSessionWithConfirm', () => {
    it('shows a confirm dialogue on leaving the session', async () => {
      const {result} = renderHook(() => useLeaveSession());

      await act(() => result.current.leaveSessionWithConfirm());

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
            style: 'destructive',
            text: 'Some translation',
          },
        ],
      );
    });

    it('leaves the call, resets the state and navigates on confirming', async () => {
      alertConfirmMock.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        config[1].onPress();
      });

      const {result} = renderHook(() => useLeaveSession());

      await act(() => result.current.leaveSessionWithConfirm());

      expect(alertConfirmMock).toHaveBeenCalledTimes(1);
      expect(mockLeaveMeeting).toHaveBeenCalledTimes(1);
      expect(useResetRecoilState).toHaveBeenCalledTimes(1);
      expect(useResetRecoilState).toHaveBeenCalledWith(sessionAtom);
      expect(resetState).toHaveBeenCalledTimes(1);
      expect(navigation.navigate as jest.Mock).toHaveBeenCalledTimes(1);
    });

    it('does nothing on dismiss', async () => {
      alertConfirmMock.mockImplementationOnce((header, text, config) => {
        // Run the dismiss action
        config[0].onPress();
      });

      const {result} = renderHook(() => useLeaveSession());

      await act(() => result.current.leaveSessionWithConfirm());

      expect(alertConfirmMock).toHaveBeenCalledTimes(1);
      expect(mockLeaveMeeting).toHaveBeenCalledTimes(0);
      expect(resetState).toHaveBeenCalledTimes(0);
      expect(navigation.navigate as jest.Mock).toHaveBeenCalledTimes(0);
    });
  });
});
