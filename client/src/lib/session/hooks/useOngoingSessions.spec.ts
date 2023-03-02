import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import {OngoingSessionEvent} from '../../../../../shared/src/types/Event';

import {LiveSession} from '../../../../../shared/src/types/Session';
import {getSession} from '../../sessions/api/session';
import useUserState from '../../user/state/state';
import useOngoingSessions from './useOngoingSessions';

jest.mock('../../sessions/api/session');
const mockedGetSession = jest.mocked(getSession);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useOngoingSessions', () => {
  describe('getOngoingSessions', () => {
    beforeEach(() => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            userEvents: [
              {payload: {id: 'session-id-1'}, type: 'ongoingSession'},
              {payload: {id: 'session-id-2'}, type: 'ongoingSession'},
              {payload: {id: 'session-id-3'}, type: 'ongoingSession'},
            ] as OngoingSessionEvent[],
          },
        },
      });
    });

    it('shouldnt fetch any session when ongoingSession events is empty', async () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            userEvents: [],
          },
        },
      });
      const {result} = renderHook(() => useOngoingSessions());

      const sessions = await result.current.getOngoingSessions();

      expect(mockedGetSession).toHaveBeenCalledTimes(0);
      expect(sessions).toEqual([]);
    });

    it('fetches all sessions from ongoingSession user events', async () => {
      mockedGetSession.mockImplementation(id =>
        Promise.resolve({id} as LiveSession),
      );

      const {result} = renderHook(() => useOngoingSessions());

      const sessions = await result.current.getOngoingSessions();

      expect(mockedGetSession).toHaveBeenCalledTimes(3);
      expect(sessions).toEqual([
        {id: 'session-id-1'},
        {id: 'session-id-2'},
        {id: 'session-id-3'},
      ]);
    });

    it('returns only sessions that have not yet ended', async () => {
      mockedGetSession.mockResolvedValueOnce({
        id: 'session-id-1',
        ended: false,
      } as LiveSession);
      mockedGetSession.mockResolvedValueOnce({
        id: 'session-id-2',
        ended: false,
      } as LiveSession);
      mockedGetSession.mockResolvedValueOnce({
        id: 'session-id-3',
        ended: true,
      } as LiveSession);

      const {result} = renderHook(() => useOngoingSessions());

      const sessions = await result.current.getOngoingSessions();

      expect(mockedGetSession).toHaveBeenCalledTimes(3);
      expect(sessions).toEqual([
        {id: 'session-id-1', ended: false},
        {id: 'session-id-2', ended: false},
      ]);
    });

    it('should remove ongoingSession user events from ended sessions', async () => {
      mockedGetSession.mockResolvedValueOnce({
        id: 'session-id-1',
        ended: false,
      } as LiveSession);
      mockedGetSession.mockResolvedValueOnce({
        id: 'session-id-2',
        ended: true,
      } as LiveSession);
      mockedGetSession.mockResolvedValueOnce({
        id: 'session-id-3',
        ended: true,
      } as LiveSession);

      const {result} = renderHook(() => useOngoingSessions());

      await result.current.getOngoingSessions();

      expect(useUserState.getState().userState['user-id'].userEvents).toEqual([
        {payload: {id: 'session-id-1'}, type: 'ongoingSession'},
      ]);
    });
  });
});

describe('addOngoingSession', () => {
  it('does not duplicate when session has already been aded as ongoing', async () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          userEvents: [
            {
              payload: {id: 'some-session-id'},
              timestamp: expect.any(String),
              type: 'ongoingSession',
            },
          ],
        },
      },
    });

    const {result} = renderHook(() => useOngoingSessions());

    await result.current.addOngoingSession('some-session-id');

    expect(useUserState.getState().userState['user-id'].userEvents).toEqual([
      {
        payload: {id: 'some-session-id'},
        timestamp: expect.any(String),
        type: 'ongoingSession',
      },
    ]);
  });
  it('saves the provided id as an ongoingSession user event', async () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          userEvents: [],
        },
      },
    });

    const {result} = renderHook(() => useOngoingSessions());

    await result.current.addOngoingSession('some-session-id');

    expect(useUserState.getState().userState['user-id'].userEvents).toEqual([
      {
        payload: {id: 'some-session-id'},
        timestamp: expect.any(String),
        type: 'ongoingSession',
      },
    ]);
  });
});
