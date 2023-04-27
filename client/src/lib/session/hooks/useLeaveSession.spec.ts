import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {act, renderHook} from '@testing-library/react-hooks';
import {useTranslation} from 'react-i18next';
import {Alert as AlertMock} from 'react-native';
import {CompletedSessionPayload} from '../../../../../shared/src/types/Event';
import {
  AsyncSession,
  LiveSession,
  SessionState,
  SessionMode,
  SessionType,
} from '../../../../../shared/src/schemas/Session';
import useUserState from '../../user/state/state';
import useSessionState from '../state/state';
import useLeaveSession from './useLeaveSession';

const alertConfirmMock = AlertMock.alert as jest.Mock;

jest.mock('../../../lib/daily/DailyProvider', () => ({
  DailyContext: jest.fn(),
}));

const mockLeaveMeeting = jest.fn();
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: jest.fn(() => ({leaveMeeting: mockLeaveMeeting})),
}));

const mockLogLiveSessionMetricEvent = jest.fn();
const mockLogAsyncSessionMetricEvent = jest.fn();
jest.mock(
  './useLiveSessionMetricEvents',
  () => () => mockLogLiveSessionMetricEvent,
);
jest.mock(
  './useAsyncSessionMetricEvents',
  () => () => mockLogAsyncSessionMetricEvent,
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useLeaveSession', () => {
  const {t} = useTranslation();
  (t as unknown as jest.Mock).mockReturnValue('Some translation');
  const navigation = useNavigation();
  const mockNavigate = jest.mocked(navigation.navigate);

  describe('leaveSession', () => {
    it('leaves the call, resets the state and navigates', async () => {
      useSessionState.setState({
        liveSession: {
          id: 'some-session-id',
        } as LiveSession,
      });

      const {result} = renderHook(() =>
        useLeaveSession({
          id: 'some-session-id',
          type: SessionType.public,
          mode: SessionMode.live,
        } as LiveSession),
      );

      await act(() => result.current.leaveSession());

      expect(mockLeaveMeeting).toHaveBeenCalledTimes(1);
      expect(useSessionState.getState().liveSession).toBe(null);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('resets the state and navigates on async sessions', async () => {
      useSessionState.setState({
        asyncSession: {
          id: 'some-session-id',
        } as AsyncSession,
      });

      const {result} = renderHook(() =>
        useLeaveSession({
          id: 'some-session-id',
          type: SessionType.public,
          mode: SessionMode.async,
        } as AsyncSession),
      );

      await act(() => result.current.leaveSession());

      expect(mockLeaveMeeting).toHaveBeenCalledTimes(0);
      expect(useSessionState.getState().liveSession).toBe(null);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('navigates to session feedback modal with set params if session is started', async () => {
      useSessionState.setState({
        sessionState: {
          started: true,
          completed: true,
        } as SessionState,
      });
      const {result} = renderHook(() =>
        useLeaveSession({
          id: 'some-session-id',
          hostId: 'some-host-id',
          exerciseId: 'some-exercise-id',
          type: SessionType.public,
          mode: SessionMode.live,
        } as LiveSession),
      );

      await act(() => result.current.leaveSession());

      expect(mockNavigate).toHaveBeenCalledWith('SessionFeedbackModal', {
        exerciseId: 'some-exercise-id',
        completed: true,
        sessionId: 'some-session-id',
        isHost: false,
        sessionMode: 'live',
        sessionType: 'public',
      });
    });
  });

  describe('leaveSessionWithConfirm', () => {
    it('shows a confirm dialogue on leaving the session', async () => {
      const {result} = renderHook(() =>
        useLeaveSession({
          id: 'some-session-id',
          type: SessionType.public,
          mode: SessionMode.live,
        } as LiveSession),
      );

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
      useSessionState.setState({
        liveSession: {id: 'some-live-session-id'} as LiveSession,
        asyncSession: {id: 'some-async-session-id'} as AsyncSession,
        sessionState: {
          id: 'some-session-id',
          started: true,
        } as SessionState,
      });

      alertConfirmMock.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        config[1].onPress();
      });

      const {result} = renderHook(() =>
        useLeaveSession({
          id: 'some-session-id',
          type: SessionType.public,
          mode: SessionMode.live,
        } as LiveSession),
      );

      await act(() => result.current.leaveSessionWithConfirm());

      expect(alertConfirmMock).toHaveBeenCalledTimes(1);
      expect(mockLeaveMeeting).toHaveBeenCalledTimes(1);
      expect(useSessionState.getState().liveSession).toBe(null);
      expect(useSessionState.getState().sessionState).toBe(null);
      expect(mockLogLiveSessionMetricEvent).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenCalledWith('Home');
      expect(mockNavigate).toHaveBeenCalledWith('SessionFeedbackModal', {
        completed: false,
        exerciseId: undefined,
        isHost: false,
        sessionId: 'some-session-id',
        sessionMode: 'live',
        sessionType: 'public',
      });
    });

    it('resets the state and navigates on confirming on async sessions', async () => {
      useSessionState.setState({
        sessionState: {
          id: 'some-session-id',
          started: true,
          completed: true,
        } as SessionState,
      });
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            userEvents: [
              {
                type: 'completedSession',
                payload: {id: 'some-session-id'} as CompletedSessionPayload,
                timestamp: new Date().toISOString(),
              },
            ],
          },
        },
      });

      alertConfirmMock.mockImplementationOnce((header, text, config) => {
        // Run the confirm action
        config[1].onPress();
      });

      const {result} = renderHook(() =>
        useLeaveSession({
          id: 'some-session-id',
          type: SessionType.private,
          mode: SessionMode.async,
        } as AsyncSession),
      );

      await act(() => result.current.leaveSessionWithConfirm());

      expect(alertConfirmMock).toHaveBeenCalledTimes(1);
      expect(mockLeaveMeeting).toHaveBeenCalledTimes(0);
      expect(useSessionState.getState().liveSession).toBe(null);
      expect(useSessionState.getState().sessionState).toBe(null);
      expect(mockNavigate).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenCalledWith('Home');
      expect(mockNavigate).toHaveBeenCalledWith('SessionFeedbackModal', {
        completed: true,
        exerciseId: undefined,
        isHost: false,
        sessionId: 'some-session-id',
        sessionMode: 'async',
        sessionType: 'private',
      });
    });

    it('does nothing on dismiss', async () => {
      useSessionState.setState({
        liveSession: {id: 'some-session-id'} as LiveSession,
        sessionState: {
          id: 'some-session-id',
          started: true,
        } as SessionState,
      });

      alertConfirmMock.mockImplementationOnce((header, text, config) => {
        // Run the dismiss action
        config[0].onPress();
      });

      const {result} = renderHook(() =>
        useLeaveSession({
          id: 'some-session-id',
          type: SessionType.public,
          mode: SessionMode.live,
        } as LiveSession),
      );

      await act(() => result.current.leaveSessionWithConfirm());

      expect(alertConfirmMock).toHaveBeenCalledTimes(1);
      expect(mockLeaveMeeting).toHaveBeenCalledTimes(0);
      expect(useSessionState.getState().liveSession).toEqual({
        id: 'some-session-id',
      });
      expect(useSessionState.getState().sessionState).toEqual({
        id: 'some-session-id',
        started: true,
      });
      expect(mockNavigate).toHaveBeenCalledTimes(0);
    });
  });
});
