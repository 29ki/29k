import v2, {V2State, V2UserState} from './v2';

jest.mock('../../../sessions/api/session');

afterEach(jest.clearAllMocks);

describe('v2', () => {
  it('should return state as is if completed sessions is not present', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {someProp: 'test'},
      },
    } as V2State;

    const unchangedState = await v2(state);

    expect(unchangedState).toEqual(state);
  });

  it('should migrate completedSessions contentId -> exerciseId', async () => {
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
              completedAt: new Date().toISOString(),
            },
            {
              id: 'session-id-2',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'en',
              type: 'private',
              completedAt: new Date().toISOString(),
            },
            {
              id: 'session-id-3',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'sv',
              type: 'async',
              completedAt: new Date().toISOString(),
            },
          ],
        } as V2UserState,
      },
    };

    const newState = await v2(state);
    expect(newState).toEqual({
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session', expires: expect.any(Date)}],
          completedSessions: [
            {
              id: 'session-id-1',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'en',
              type: 'public',
              mode: 'live',
              completedAt: expect.any(String),
            },
            {
              id: 'session-id-2',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'en',
              type: 'private',
              mode: 'live',
              completedAt: expect.any(String),
            },
            {
              id: 'session-id-3',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'sv',
              type: 'public',
              mode: 'async',
              completedAt: expect.any(String),
            },
          ],
        },
      },
    });
  });
});
