import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import {PostPayload} from '../../../../../shared/src/types/Event';
import useUserState from '../state/state';
import useCurrentUserState from './useCurrentUserState';

describe('useCurrentUserState', () => {
  it('should return current user state', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          pinnedSessions: [{id: 'session-id', expires: new Date()}],
          userEvents: [
            {
              type: 'post',
              payload: {sessionId: 'some-session-id'} as PostPayload,
              timestamp: new Date(),
            },
          ],
        },
      },
    });

    const {result} = renderHook(() => useCurrentUserState());

    expect(result.current).toEqual({
      pinnedSessions: [{id: 'session-id', expires: expect.any(Date)}],
      userEvents: [
        {
          type: 'post',
          payload: {sessionId: 'some-session-id'} as PostPayload,
          timestamp: expect.any(Date),
        },
      ],
    });
  });
});
