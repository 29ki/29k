import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import {CompletedSessionPayload} from '../../../../../shared/src/types/Event';
import useUserState from '../state/state';
import useCompletedSessionById from './useCompletedSessionById';

describe('useCompletedSessionById', () => {
  it('should return expected session', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          userEvents: [
            {
              type: 'completedSession',
              payload: {id: 'some-session-id'} as CompletedSessionPayload,
              timestamp: new Date(),
            },
          ],
        },
      },
    });

    const {result} = renderHook(() =>
      useCompletedSessionById('some-session-id'),
    );

    expect(result.current).toEqual({
      type: 'completedSession',
      payload: {id: 'some-session-id'},
      timestamp: expect.any(Date),
    });
  });

  it('should memoize the result', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          userEvents: [
            {
              type: 'completedSession',
              payload: {id: 'some-session-id'} as CompletedSessionPayload,
              timestamp: new Date(),
            },
          ],
        },
      },
    });

    const {result, rerender} = renderHook(() =>
      useCompletedSessionById('some-session-id'),
    );

    const completedSession = result.current;

    rerender();

    // Check that they are the same reference
    expect(result.current).toBe(completedSession);
  });
});
