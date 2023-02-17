import v3, {V3PostPayload, V3State, V3UserState} from './v3';

jest.mock('../../../sessions/api/session');

afterEach(jest.clearAllMocks);

describe('v3', () => {
  it('should return state as is if completed sessions is not present', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {someProp: 'test'},
      },
    } as V3State;

    const unchangedState = await v3(state);

    expect(unchangedState).toEqual(state);
  });

  it('should migrate completedSessions to useEvents', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session', expires: new Date()}],
          userEvents: [
            {
              type: 'post',
              payload: {sessionId: 'session-id-1'} as unknown as V3PostPayload,
              timestamp: new Date(),
            },
          ],
          completedSessions: [
            {
              id: 'session-id-1',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'en',
              type: 'public',
              mode: 'live',
              completedAt: new Date(),
            },
            {
              id: 'session-id-1',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'en',
              type: 'public',
              mode: 'live',
              completedAt: new Date(),
            },
            {
              id: 'session-id-2',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'en',
              type: 'private',
              mode: 'live',
              completedAt: new Date(),
            },
            {
              id: 'session-id-3',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'sv',
              type: 'public',
              mode: 'async',
              completedAt: new Date(),
            },
          ],
        } as V3UserState,
      },
    };

    const newState = await v3(state);
    expect(newState).toEqual({
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session', expires: expect.any(Date)}],
          userEvents: [
            {
              type: 'post',
              payload: {
                sessionId: 'session-id-1',
              },
              timestamp: expect.any(Date),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'session-id-1',
                hostId: 'host-id',
                exerciseId: 'exercise-id',
                language: 'en',
                type: 'public',
                mode: 'live',
              },
              timestamp: expect.any(Date),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'session-id-2',
                hostId: 'host-id',
                exerciseId: 'exercise-id',
                language: 'en',
                type: 'private',
                mode: 'live',
              },
              timestamp: expect.any(Date),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'session-id-3',
                hostId: 'host-id',
                exerciseId: 'exercise-id',
                language: 'sv',
                type: 'public',
                mode: 'async',
              },
              timestamp: expect.any(Date),
            },
          ],
        },
      },
    });
  });

  it('should migrate completedSessions to useEvents when existing useEvents is undefined', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session', expires: new Date()}],
          completedSessions: [
            {
              id: 'session-id-1',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'en',
              type: 'public',
              mode: 'live',
              completedAt: new Date(),
            },
            {
              id: 'session-id-1',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'en',
              type: 'public',
              mode: 'live',
              completedAt: new Date(),
            },
            {
              id: 'session-id-2',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'en',
              type: 'private',
              mode: 'live',
              completedAt: new Date(),
            },
            {
              id: 'session-id-3',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'sv',
              type: 'public',
              mode: 'async',
              completedAt: new Date(),
            },
          ],
        } as V3UserState,
      },
    };

    const newState = await v3(state);
    expect(newState).toEqual({
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session', expires: expect.any(Date)}],
          userEvents: [
            {
              type: 'completedSession',
              payload: {
                id: 'session-id-1',
                hostId: 'host-id',
                exerciseId: 'exercise-id',
                language: 'en',
                type: 'public',
                mode: 'live',
              },
              timestamp: expect.any(Date),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'session-id-2',
                hostId: 'host-id',
                exerciseId: 'exercise-id',
                language: 'en',
                type: 'private',
                mode: 'live',
              },
              timestamp: expect.any(Date),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'session-id-3',
                hostId: 'host-id',
                exerciseId: 'exercise-id',
                language: 'sv',
                type: 'public',
                mode: 'async',
              },
              timestamp: expect.any(Date),
            },
          ],
        },
      },
    });
  });
});
