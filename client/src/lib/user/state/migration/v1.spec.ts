import v1, {V1State, V1UserState} from './v1';

jest.mock('../../../sessions/api/session');

afterEach(jest.clearAllMocks);

describe('v1', () => {
  it('should return state as is if completed sessions is not present', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {someProp: 'test'},
      },
    } as V1State;

    const unchangedState = await v1(state);

    expect(unchangedState).toEqual(state);
  });

  it('should migrate completedSessions contentId -> exerciseId', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session'}],
          completedSessions: [
            {
              id: 'session-id-1',
              hostId: 'host-id',
              contentId: 'exercise-id',
              language: 'en',
              type: 'public',
              completedAt: new Date().toISOString(),
            },
            {
              id: 'session-id-2',
              hostId: 'host-id',
              contentId: 'exercise-id',
              language: 'sv',
              type: 'private',
              completedAt: new Date().toISOString(),
            },
          ],
        } as V1UserState,
      },
    };

    const newState = await v1(state);
    expect(newState).toEqual({
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session'}],
          completedSessions: [
            {
              id: 'session-id-1',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'en',
              type: 'public',
              completedAt: expect.any(String),
            },
            {
              id: 'session-id-2',
              hostId: 'host-id',
              exerciseId: 'exercise-id',
              language: 'sv',
              type: 'private',
              completedAt: expect.any(String),
            },
          ],
        },
      },
    });
  });
});
