import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook, act} from '@testing-library/react-hooks';
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
            completedSessions: [],
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
            completedSessions: [],
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

  describe('addCompletedSession', () => {
    it('should set completed sessions on empty userState', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {},
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.addCompletedSession({
          id: 'session-id',
          completedAt: new Date(),
        });
      });

      expect(result.current.userState['user-id'].completedSessions).toEqual([
        {id: 'session-id', completedAt: expect.any(Date)},
      ]);
    });

    it('should add completed session on existing userState', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [],
            completedSessions: [{id: 'session-id', completedAt: new Date()}],
          },
        },
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.addCompletedSession({
          id: 'another-session-id',
          completedAt: new Date(),
        });
      });

      expect(result.current.userState['user-id'].completedSessions).toEqual([
        {id: 'session-id', completedAt: expect.any(Date)},
        {id: 'another-session-id', completedAt: expect.any(Date)},
      ]);
    });

    it('should keep other users state', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id-2': {
            pinnedSessions: [],
            completedSessions: [{id: 'session-id', completedAt: new Date()}],
          },
        },
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.addCompletedSession({
          id: 'session-id',
          completedAt: new Date(),
        });
      });

      expect(result.current.userState['user-id'].completedSessions).toEqual([
        {id: 'session-id', completedAt: expect.any(Date)},
      ]);
      expect(result.current.userState['user-id-2'].completedSessions).toEqual([
        {id: 'session-id', completedAt: expect.any(Date)},
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
            completedSessions: [
              {id: 'completed-session-id', completedAt: new Date()},
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
      expect(result.current.userState['user-id'].completedSessions).toEqual([
        {id: 'completed-session-id', completedAt: expect.any(Date)},
      ]);
    });

    it('should delete only current user state deleted', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [{id: 'pinned-session-id', expires: new Date()}],
            completedSessions: [
              {id: 'completed-session-id', completedAt: new Date()},
            ],
          },
          'user-id-2': {
            pinnedSessions: [{id: 'pinned-session-id', expires: new Date()}],
            completedSessions: [
              {id: 'completed-session-id', completedAt: new Date()},
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
      expect(result.current.userState['user-id-2'].completedSessions).toEqual([
        {id: 'completed-session-id', completedAt: expect.any(Date)},
      ]);
    });
  });
});
