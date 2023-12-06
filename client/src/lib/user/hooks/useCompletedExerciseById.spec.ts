import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import {CompletedSessionPayload} from '../../../../../shared/src/types/Event';
import useUserState from '../state/state';
import useCompletedExerciseById from './useCompletedExerciseById';

describe('useCompletedExerciseById', () => {
  it('should return expected exercise', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          userEvents: [
            {
              type: 'completedSession',
              payload: {
                exerciseId: 'some-exercise-id',
              } as CompletedSessionPayload,
              timestamp: new Date().toISOString(),
            },
          ],
        },
      },
    });

    const {result} = renderHook(() =>
      useCompletedExerciseById('some-exercise-id'),
    );

    expect(result.current).toEqual({
      type: 'completedSession',
      payload: {exerciseId: 'some-exercise-id'},
      timestamp: expect.any(String),
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
              payload: {
                exerciseId: 'some-exercise-id',
              } as CompletedSessionPayload,
              timestamp: new Date().toISOString(),
            },
          ],
        },
      },
    });

    const {result, rerender} = renderHook(() =>
      useCompletedExerciseById('some-exercise-id'),
    );

    const completedSession = result.current;

    rerender();

    // Check that they are the same reference
    expect(result.current).toBe(completedSession);
  });
});
