import {useNavigation} from '@react-navigation/native';
import {act, renderHook} from '@testing-library/react-hooks';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {getSession} from '../../sessions/api/session';
import useSessions from '../../sessions/hooks/useSessions';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import useUserState from '../../user/state/state';
import useIsAllowedToJoin from './useIsAllowedToJoin';
import useSessionState from '../state/state';
import {ValidateSessionError} from '../../../../../shared/src/errors/Session';

jest.mock('../../sessions/api/session');
jest.mock('../../sessions/hooks/useSessions');

const mockGetSession = jest.mocked(getSession);
const mockUseSession = jest.mocked(useSessions);

afterEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers().useRealTimers();
});

describe('useIsAllowedToJoin', () => {
  const navigation = useNavigation();
  const mockNavigate = jest.mocked(navigation.navigate);
  const mockFetchSessions = jest.fn();
  mockUseSession.mockReturnValue({
    fetchSessions: mockFetchSessions,
  } as any);

  it('should be allowed to when backend returns a valid session', async () => {
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
    });
    mockGetSession.mockResolvedValueOnce({
      closingTime: '2023-05-16T10:05:00Z',
      hostId: 'some-host-id',
    } as LiveSessionType);

    const {result} = renderHook(() => useIsAllowedToJoin());

    await act(async () => {
      const res = await result.current('some-session-id');
      expect(res).toBe(true);
      expect(mockGetSession).toHaveBeenCalledWith('some-session-id');
      expect(mockNavigate).toHaveBeenCalledTimes(0);
      expect(mockFetchSessions).toHaveBeenCalledTimes(0);
    });
  });

  const useTestHook = () => {
    const isAllowedToJoin = useIsAllowedToJoin();
    const sessionState = useSessionState(state => state);

    return {isAllowedToJoin, sessionState};
  };

  it('should not be allowed to join when session could not be found', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-05-16T10:00:00Z'));
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
    });
    useSessionState.setState({
      liveSession: {id: 'some-sesssion-id'} as LiveSessionType,
    });
    mockGetSession.mockRejectedValueOnce(
      new Error(ValidateSessionError.notFound),
    );

    const {result} = renderHook(() => useTestHook());

    try {
      await act(async () => {
        await result.current.isAllowedToJoin('some-session-id');
      });
    } catch (error) {}

    expect(mockGetSession).toHaveBeenCalledWith('some-session-id');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockFetchSessions).toHaveBeenCalledTimes(1);
    expect(result.current.sessionState.liveSession).toBe(null);
  });

  it('should not be allowed to join when session user is not found', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-05-16T10:00:00Z'));
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
    });
    useSessionState.setState({
      liveSession: {id: 'some-sesssion-id'} as LiveSessionType,
    });
    mockGetSession.mockRejectedValueOnce(
      new Error(ValidateSessionError.userNotFound),
    );

    const {result} = renderHook(() => useTestHook());

    try {
      await act(async () => {
        await result.current.isAllowedToJoin('some-session-id');
      });
    } catch (error) {}

    expect(mockGetSession).toHaveBeenCalledWith('some-session-id');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockFetchSessions).toHaveBeenCalledTimes(1);
    expect(result.current.sessionState.liveSession).toBe(null);
  });

  it('should not be allowed to join when session user is not authorized', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-05-16T10:00:00Z'));
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
    });
    useSessionState.setState({
      liveSession: {id: 'some-sesssion-id'} as LiveSessionType,
    });
    mockGetSession.mockRejectedValueOnce(
      new Error(ValidateSessionError.userNotAuthorized),
    );

    const {result} = renderHook(() => useTestHook());

    try {
      await act(async () => {
        await result.current.isAllowedToJoin('some-session-id');
      });
    } catch (error) {}

    expect(mockGetSession).toHaveBeenCalledWith('some-session-id');
    expect(mockNavigate).toHaveBeenCalledTimes(2);
    expect(mockFetchSessions).toHaveBeenCalledTimes(1);
    expect(result.current.sessionState.liveSession).toBe(null);
  });

  it('should not be allowed to join and not reset on unexpected error', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-05-16T10:00:00Z'));
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
    });
    useSessionState.setState({
      liveSession: {id: 'some-sesssion-id'} as LiveSessionType,
    });
    mockGetSession.mockRejectedValueOnce(new Error(undefined));

    const {result} = renderHook(() => useTestHook());

    try {
      await act(async () => {
        await result.current.isAllowedToJoin('some-session-id');
      });
    } catch (error) {}

    expect(mockGetSession).toHaveBeenCalledWith('some-session-id');
    expect(mockNavigate).toHaveBeenCalledTimes(0);
    expect(mockFetchSessions).toHaveBeenCalledTimes(0);
    expect(result.current.sessionState.liveSession).toEqual({
      id: 'some-sesssion-id',
    });
  });
});
