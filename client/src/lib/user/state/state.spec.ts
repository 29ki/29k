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

  describe('reset', () => {
    it('should keep user state when not deleted', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [{id: 'session-id', expires: new Date()}],
          },
        },
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.reset();
      });

      expect(result.current.userState['user-id'].pinnedSessions).toEqual([
        {id: 'session-id', expires: expect.any(Date)},
      ]);
    });

    it('should delete only current user state deleted', () => {
      useUserState.setState({
        user: {uid: 'user-id'} as FirebaseAuthTypes.User,
        userState: {
          'user-id': {
            pinnedSessions: [{id: 'session-id', expires: new Date()}],
          },
          'user-id-2': {
            pinnedSessions: [{id: 'session-id', expires: new Date()}],
          },
        },
      });

      const {result} = renderHook(() => useUserState());

      act(() => {
        result.current.reset(true);
      });

      expect(result.current.userState['user-id']).toBe(undefined);
      expect(result.current.userState['user-id-2'].pinnedSessions).toEqual([
        {id: 'session-id', expires: expect.any(Date)},
      ]);
    });
  });
});
