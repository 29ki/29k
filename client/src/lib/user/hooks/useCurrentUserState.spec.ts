import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import useUserState from '../state/state';
import useCurrentUserState from './useCurrentUserState';

describe('useCurrentUserState', () => {
  it('should return current user state', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          pinnedSessions: [{id: 'session-id', expires: new Date()}],
          completedSessions: [
            {id: 'other-session-id', completedAt: new Date()},
          ],
        },
      },
    });

    const {result} = renderHook(() => useCurrentUserState());

    expect(result.current).toEqual({
      pinnedSessions: [{id: 'session-id', expires: expect.any(Date)}],
      completedSessions: [
        {id: 'other-session-id', completedAt: expect.any(Date)},
      ],
    });
  });
});
