import {useNavigation} from '@react-navigation/native';
import {act, renderHook} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import {Alert as AlertMock} from 'react-native';
import useLeaveSession from './useLeaveSession';
import useLogSessionMetricEvents from './useLogSessionMetricEvents';

const alertConfirmMock = AlertMock.alert as jest.Mock;

jest.mock('../../../lib/daily/DailyProvider', () => ({
  DailyContext: jest.fn(),
}));

const mockLeaveMeeting = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({leaveMeeting: mockLeaveMeeting})),
}));

const mockResetSessionState = jest.fn();
jest.mock('../state/state', () =>
  jest.fn(fn => fn({reset: mockResetSessionState})),
);

const mockConditionallyLogLeaveSessionMetricEvent = jest.fn();
jest.mock('./useLogSessionMetricEvents', () => () => ({
  conditionallyLogLeaveSessionMetricEvent:
    mockConditionallyLogLeaveSessionMetricEvent,
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useLeaveSession', () => {
  const {t} = useTranslation();
  (t as unknown as jest.Mock).mockReturnValue('Some translation');
  const navigation = useNavigation();

  describe('leaveSession', () => {
    it('leaves the call, resets the state and navigates on confirming', async () => {
      const {result} = renderHook(() => useLeaveSession());

      await act(() => result.current.leaveSession());

      expect(mockLeaveMeeting).toHaveBeenCalledTimes(1);
      expect(mockResetSessionState).toHaveBeenCalledTimes(1);
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
      expect(mockResetSessionState).toHaveBeenCalledTimes(1);
      expect(mockConditionallyLogLeaveSessionMetricEvent).toHaveBeenCalledTimes(
        1,
      );
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
      expect(mockResetSessionState).toHaveBeenCalledTimes(0);
      expect(navigation.navigate as jest.Mock).toHaveBeenCalledTimes(0);
    });
  });
});
