import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import useUserState, {CompletedSession} from '../state/state';
import useCompletedSessionById from './useCompletedSessionById';

describe('useCompletedSessionById', () => {
  it('should return expected session', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          completedSessions: [{id: 'some-session-id'} as CompletedSession],
        },
      },
    });

    const {result} = renderHook(() =>
      useCompletedSessionById('some-session-id'),
    );

    expect(result.current).toEqual({id: 'some-session-id'});
  });

  it('should memoize the result', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          completedSessions: [{id: 'some-session-id'} as CompletedSession],
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
