import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook, act} from '@testing-library/react-hooks';
import {PostPayload, UserEvent} from '../../../../../shared/src/types/Event';
import useUserState from './state';

describe('user - state', () => {
  describe('setPinnedState', () => {
    it('should set pinned sessions on empty userState', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {},
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.setPinnedSessions([
          {id: 'session-id', expires: new Date()},
        ]);
      });

      expect(result.current.userState['user-id'].pinnedSessions).toEqual([
        {id: 'session-id', expires: expect.any(Date)},
      ]);
    });
    it('should replace pinned sessions on existing userState', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [{id: 'other-session-id', expires: new Date()}],
          },
        },
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.setPinnedSessions([
          {id: 'session-id', expires: new Date()},
        ]);
      });

      expect(result.current.userState['user-id'].pinnedSessions).toEqual([
        {id: 'session-id', expires: expect.any(Date)},
      ]);
    });

    it('should keep other users state', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id-2': {
            pinnedSessions: [{id: 'other-session-id', expires: new Date()}],
          },
        },
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.setPinnedSessions([
          {id: 'session-id', expires: new Date()},
        ]);
      });

      expect(result.current.userState['user-id'].pinnedSessions).toEqual([
        {id: 'session-id', expires: expect.any(Date)},
      ]);
      expect(result.current.userState['user-id-2'].pinnedSessions).toEqual([
        {id: 'other-session-id', expires: expect.any(Date)},
      ]);
    });
  });

  describe('addUserEvent', () => {
    it('should add post event to empty userState', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {},
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.addUserEvent('post', {
          sessionId: 'some-session-id',
        } as PostPayload);
      });

      expect(result.current.userState['user-id'].userEvents).toEqual([
        {
          type: 'post',
          payload: {sessionId: 'some-session-id'},
          timestamp: expect.any(String),
        },
      ]);
    });

    it('should add post event on existing userState', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            userEvents: [
              {
                type: 'post',
                payload: {sessionId: 'some-session-id'} as PostPayload,
                timestamp: new Date().toISOString(),
              },
            ],
          },
        },
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.addUserEvent('post', {
          sessionId: 'some-other-session-id',
        } as PostPayload);
      });

      expect(result.current.userState['user-id'].userEvents).toEqual([
        {
          type: 'post',
          payload: {sessionId: 'some-session-id'},
          timestamp: expect.any(String),
        },
        {
          type: 'post',
          payload: {sessionId: 'some-other-session-id'},
          timestamp: expect.any(String),
        },
      ]);
    });

    it('should keep other users state', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id-2': {
            userEvents: [
              {
                type: 'post',
                payload: {sessionId: 'some-session-id'} as PostPayload,
                timestamp: new Date().toISOString(),
              },
            ],
          },
        },
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.addUserEvent('post', {
          sessionId: 'some-other-session-id',
        } as PostPayload);
      });

      expect(result.current.userState['user-id'].userEvents).toEqual([
        {
          type: 'post',
          payload: {sessionId: 'some-other-session-id'},
          timestamp: expect.any(String),
        },
      ]);
      expect(result.current.userState['user-id-2'].userEvents).toEqual([
        {
          type: 'post',
          payload: {sessionId: 'some-session-id'},
          timestamp: expect.any(String),
        },
      ]);
    });
  });

  describe('removeUserEvent', () => {
    it('should remove ongoingSession events only from current user', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'other-user-id': {
            userEvents: [
              {type: 'ongoingSession', payload: {id: 'some-id'}},
              {type: 'ongoingSession', payload: {id: 'some-id-2'}},
            ] as UserEvent[],
          },
          'user-id': {
            userEvents: [
              {type: 'ongoingSession', payload: {id: 'some-id'}},
              {type: 'ongoingSession', payload: {id: 'some-id'}},
              {type: 'post', payload: {id: 'some-id'}},
              {type: 'completedSession', payload: {id: 'some-id'}},
            ] as UserEvent[],
          },
        },
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.removeUserEvent(e => e.type === 'ongoingSession');
      });

      expect(result.current.userState['user-id'].userEvents).toEqual([
        {payload: {id: 'some-id'}, type: 'post'},
        {payload: {id: 'some-id'}, type: 'completedSession'},
      ]);
      expect(result.current.userState['other-user-id'].userEvents).toEqual([
        {payload: {id: 'some-id'}, type: 'ongoingSession'},
        {payload: {id: 'some-id-2'}, type: 'ongoingSession'},
      ]);
    });
  });

  describe('reset', () => {
    it('should keep user state when not deleted', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [{id: 'pinned-session-id', expires: new Date()}],
            userEvents: [
              {
                type: 'post',
                payload: {sessionId: 'some-session-id'} as PostPayload,
                timestamp: new Date().toISOString(),
              },
            ],
          },
        },
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.reset();
      });

      expect(result.current.userState['user-id'].pinnedSessions).toEqual([
        {id: 'pinned-session-id', expires: expect.any(Date)},
      ]);
      expect(result.current.userState['user-id'].userEvents).toEqual([
        {
          type: 'post',
          payload: {sessionId: 'some-session-id'},
          timestamp: expect.any(String),
        },
      ]);
    });

    it('should delete only current user state deleted', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [{id: 'pinned-session-id', expires: new Date()}],
            userEvents: [
              {
                type: 'post',
                payload: {sessionId: 'some-session-id'} as PostPayload,
                timestamp: new Date().toISOString(),
              },
            ],
          },
          'user-id-2': {
            pinnedSessions: [{id: 'pinned-session-id', expires: new Date()}],
            userEvents: [
              {
                type: 'post',
                payload: {sessionId: 'some-session-id'} as PostPayload,
                timestamp: new Date().toISOString(),
              },
            ],
          },
        },
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.reset(true);
      });

      expect(result.current.userState['user-id']).toBe(undefined);
      expect(result.current.userState['user-id-2'].pinnedSessions).toEqual([
        {id: 'pinned-session-id', expires: expect.any(Date)},
      ]);
      expect(result.current.userState['user-id-2'].userEvents).toEqual([
        {
          type: 'post',
          payload: {sessionId: 'some-session-id'},
          timestamp: expect.any(String),
        },
      ]);
    });
  });
});
