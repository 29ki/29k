import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {renderHook} from '@testing-library/react-hooks';
import {CompletedSessionPayload} from '../../../../../shared/src/types/Event';
import useUserState from '../state/state';
import useCompletedSessionByTime from './useCompletedSessionByTime';

describe('useCompletedSessionByTime', () => {
  it('should return expected session', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          userEvents: [
            {
              type: 'completedSession',
              payload: {
                id: 'some-session-id',
                exerciseId: 'some-exercise-id',
              } as CompletedSessionPayload,
              timestamp: new Date('2023-01-02').toISOString(),
            },
          ],
        },
      },
    });

    const {result} = renderHook(() => useCompletedSessionByTime());

    expect(
      result.current.getCompletedSessionByExerciseId(
        'some-exercise-id',
        '2023-01-01',
      ),
    ).toEqual({
      type: 'completedSession',
      payload: {id: 'some-session-id', exerciseId: 'some-exercise-id'},
      timestamp: expect.any(String),
    });
  });

  it('should return first completed if several', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          userEvents: [
            {
              type: 'completedSession',
              payload: {
                id: 'some-session-id',
                exerciseId: 'some-exercise-id',
              } as CompletedSessionPayload,
              timestamp: new Date('2023-01-02').toISOString(),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'some-other-session-id',
                exerciseId: 'some-exercise-id',
              } as CompletedSessionPayload,
              timestamp: new Date('2023-01-03').toISOString(),
            },
          ],
        },
      },
    });

    const {result} = renderHook(() => useCompletedSessionByTime());

    expect(
      result.current.getCompletedSessionByExerciseId(
        'some-exercise-id',
        '2023-01-01',
      ),
    ).toEqual({
      type: 'completedSession',
      payload: {id: 'some-session-id', exerciseId: 'some-exercise-id'},
      timestamp: expect.any(String),
    });
  });

  it('should return undefined if no completed found', () => {
    useUserState.setState({
      user: {uid: 'user-id'} as FirebaseAuthTypes.User,
      userState: {
        'user-id': {
          userEvents: [
            {
              type: 'completedSession',
              payload: {
                id: 'some-session-id',
                exerciseId: 'some-exercise-id',
              } as CompletedSessionPayload,
              timestamp: new Date('2023-01-02').toISOString(),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'some-other-session-id',
                exerciseId: 'some-exercise-id',
              } as CompletedSessionPayload,
              timestamp: new Date('2023-01-03').toISOString(),
            },
          ],
        },
      },
    });

    const {result} = renderHook(() => useCompletedSessionByTime());

    expect(
      result.current.getCompletedSessionByExerciseId(
        'some-not-completed-exercise-id',
        '2023-01-01',
      ),
    ).toBe(undefined);
  });
});
