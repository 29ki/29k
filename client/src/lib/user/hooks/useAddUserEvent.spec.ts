import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {act, renderHook} from '@testing-library/react-hooks';
import {
  CompletedSessionPayload,
  PostPayload,
  UserEvent,
} from '../../../../../shared/src/types/Event';
import useUserState from '../state/state';
import useAddUserEvent from './useAddUserEvent';

jest.mock('../../content/hooks/useCollections', () => () => [
  {
    id: 'some-collection-id',
    exercises: ['exercise-id-1', 'exercise-id-2', 'exercise-id-3'],
  },
  {
    id: 'some-other-collection-id',
    exercises: ['exercise-id-3', 'exercise-id-4'],
  },
]);

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

describe('useAddUserEvent', () => {
  it('should add non completedSession events', () => {
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
      userState: {
        'some-user-id': {},
      },
    });
    const useTestHook = () => {
      const addUserEvent = useAddUserEvent();
      const userState = useUserState(state => state.userState);
      return {addUserEvent, userState};
    };
    const {result} = renderHook(useTestHook);

    act(() => {
      result.current.addUserEvent('post', {
        sessionId: 'some-session-id',
        exerciseId: 'some-exercise-id',
        sharingId: '1',
        isPublic: true,
        isAnonymous: false,
        text: 'some text',
      } as PostPayload);
    });

    expect(result.current.userState['some-user-id'].userEvents?.length).toBe(1);
    expect(result.current.userState['some-user-id'].userEvents![0]).toEqual({
      type: 'post',
      timestamp: expect.any(String),
      payload: {
        sessionId: 'some-session-id',
        exerciseId: 'some-exercise-id',
        sharingId: '1',
        isPublic: true,
        isAnonymous: false,
        text: 'some text',
      },
    });
  });

  it('should add completedSession and completedCollection events', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-05-02T12:00:00Z'));
    useUserState.setState({
      user: {uid: 'some-user-id'} as FirebaseAuthTypes.User,
      userState: {
        'some-user-id': {
          pinnedCollections: [
            {
              id: 'some-collection-id',
              startedAt: '2023-05-02T10:00:00Z',
            },
          ],
          userEvents: [
            {
              type: 'completedSession',
              payload: {
                exerciseId: 'other-exercise-id',
              } as CompletedSessionPayload,
              timestamp: '2023-05-02T11:00:00Z',
            },
            {
              type: 'completedSession',
              payload: {exerciseId: 'exercise-id-1'} as CompletedSessionPayload,
              timestamp: '2023-05-02T11:00:00Z',
            },
            {
              type: 'completedSession',
              payload: {exerciseId: 'exercise-id-2'} as CompletedSessionPayload,
              timestamp: '2023-05-02T12:00:00Z',
            },
          ],
        },
      },
    });

    const useTestHook = () => {
      const addUserEvent = useAddUserEvent();
      const userState = useUserState(state => state.userState);
      return {addUserEvent, userState};
    };
    const {result} = renderHook(useTestHook);

    act(() => {
      result.current.addUserEvent('completedSession', {
        exerciseId: 'exercise-id-3',
      } as CompletedSessionPayload);
    });

    const userEvents = result.current.userState['some-user-id']
      .userEvents as Array<UserEvent>;

    expect(userEvents.length).toBe(5);
    expect(userEvents[3]).toEqual({
      type: 'completedSession',
      payload: {exerciseId: 'exercise-id-3'},
      timestamp: expect.any(String),
    });
    expect(userEvents[4]).toEqual({
      type: 'completedCollection',
      payload: {id: 'some-collection-id'},
      timestamp: expect.any(String),
    });
  });
});
