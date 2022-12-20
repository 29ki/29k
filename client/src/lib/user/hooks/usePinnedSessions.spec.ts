import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook, act} from '@testing-library/react-hooks';
import MockDate from 'mockdate';
import {Session} from '../../../../../shared/src/types/Session';
import useSessionsState from '../../../routes/Sessions/state/state';
import useUserState from '../state/state';
import usePinnedSessons from './usePinnedSessions';

MockDate.set('2022-12-10T10:00:00'); // NOW

beforeEach(() => {
  jest.clearAllMocks();
});

describe('usePinnedSessions', () => {
  describe('sessions', () => {
    it('should return sessions that are not pinned', async () => {
      useSessionsState.setState({
        isLoading: false,
        sessions: [
          {id: 'session-id-1'},
          {id: 'session-id-2'},
        ] as Array<Session>,
      });
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2022-12-20')},
            ],
          },
        },
      });

      const {result} = renderHook(() => usePinnedSessons());

      expect(result.current.sessions).toEqual([{id: 'session-id-2'}]);
    });

    it('should return sessions when no session is pinned', async () => {
      useSessionsState.setState({
        isLoading: false,
        sessions: [
          {id: 'session-id-1'},
          {id: 'session-id-2'},
        ] as Array<Session>,
      });
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {},
      });

      const {result} = renderHook(() => usePinnedSessons());

      expect(result.current.sessions).toEqual([
        {id: 'session-id-1'},
        {id: 'session-id-2'},
      ]);
    });
  });

  describe('pinnedSessions', () => {
    it('should return pinned sessions', () => {
      useSessionsState.setState({
        isLoading: false,
        sessions: [
          {id: 'session-id-1', started: false},
          {id: 'session-id-2', started: false},
        ] as Array<Session>,
      });
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2022-12-20')},
            ],
          },
        },
      });

      const {result} = renderHook(() => usePinnedSessons());

      expect(result.current.pinnedSessions).toEqual([
        {id: 'session-id-1', started: false},
      ]);
    });
  });

  describe('isSessionPinned', () => {
    it('should return true when session is pinnded', () => {
      useSessionsState.setState({
        isLoading: false,
        sessions: [
          {id: 'session-id-1', started: false},
          {id: 'session-id-2', started: false},
        ] as Array<Session>,
      });
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2022-12-20')},
            ],
          },
        },
      });

      const {result} = renderHook(() => usePinnedSessons());

      expect(
        result.current.isSessionPinned({id: 'session-id-1'} as Session),
      ).toBe(true);
    });

    it('should return false when session is not pinnded', () => {
      useSessionsState.setState({
        isLoading: false,
        sessions: [
          {id: 'session-id-1', started: false},
          {id: 'session-id-2', started: false},
        ] as Array<Session>,
      });
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [
              {id: 'session-id-1', expires: new Date('2022-12-20')},
            ],
          },
        },
      });

      const {result} = renderHook(() => usePinnedSessons());

      expect(
        result.current.isSessionPinned({id: 'session-id-2'} as Session),
      ).toBe(false);
    });

    describe('togglePinnSession', () => {
      it('should add session as pinned', async () => {
        useSessionsState.setState({
          isLoading: false,
          sessions: [
            {id: 'session-id-1', started: false},
            {id: 'session-id-2', started: false},
          ] as Array<Session>,
        });
        useUserState.setState({
          user: {uid: 'user-id'} as FirebaseAuthTypes.User,
          userState: {},
        });

        const {result} = renderHook(() => usePinnedSessons());

        act(() => {
          result.current.togglePinnSession({id: 'session-id-1'} as Session);
        });

        expect(result.current.pinnedSessions).toEqual([
          {id: 'session-id-1', started: false},
        ]);
      });

      it('should remove existing session as pinned', async () => {
        useSessionsState.setState({
          isLoading: false,
          sessions: [
            {id: 'session-id-1', started: false},
            {id: 'session-id-2', started: false},
          ] as Array<Session>,
        });
        useUserState.setState({
          user: {uid: 'user-id'} as FirebaseAuthTypes.User,
          userState: {
            'user-id': {
              pinnedSessions: [
                {id: 'session-id-1', expires: new Date('2022-12-20')},
              ],
            },
          },
        });

        const {result} = renderHook(() => usePinnedSessons());

        act(() => {
          result.current.togglePinnSession({id: 'session-id-1'} as Session);
        });

        expect(result.current.pinnedSessions).toEqual([]);
      });

      it('should remove expired session as pinned on toggle on', async () => {
        useSessionsState.setState({
          isLoading: false,
          sessions: [
            {id: 'session-id-1', started: false},
            {id: 'session-id-2', started: false},
          ] as Array<Session>,
        });
        useUserState.setState({
          user: {uid: 'user-id'} as FirebaseAuthTypes.User,
          userState: {
            'user-id': {
              pinnedSessions: [
                {id: 'session-id-1', expires: new Date('2022-11-09')},
              ],
            },
          },
        });

        const {result} = renderHook(() => usePinnedSessons());

        act(() => {
          result.current.togglePinnSession({id: 'session-id-2'} as Session);
        });

        expect(result.current.pinnedSessions).toEqual([
          {id: 'session-id-2', started: false},
        ]);
      });

      it('should remove expired session as pinned on toggle off', async () => {
        useSessionsState.setState({
          isLoading: false,
          sessions: [
            {id: 'session-id-1', started: false},
            {id: 'session-id-2', started: false},
          ] as Array<Session>,
        });
        useUserState.setState({
          user: {uid: 'user-id'} as FirebaseAuthTypes.User,
          userState: {
            'user-id': {
              pinnedSessions: [
                {id: 'session-id-1', expires: new Date('2022-11-09')},
                {id: 'session-id-2', expires: new Date('2022-12-20')},
              ],
            },
          },
        });

        const {result} = renderHook(() => usePinnedSessons());

        act(() => {
          result.current.togglePinnSession({id: 'session-id-2'} as Session);
        });

        expect(result.current.pinnedSessions).toEqual([]);
      });
    });
  });
});
