import {
  CompletedSessionPayload,
  FeedbackPayload,
} from '../../../../../../shared/src/types/Event';
import {
  SessionMode,
  SessionType,
} from '../../../../../../shared/src/schemas/Session';
import v4, {V4State, V4UserState} from './v4';

jest.mock('../../../sessions/api/session');

afterEach(jest.clearAllMocks);

describe('v4', () => {
  it('should return state as is if completed sessions is not present', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {someProp: 'test'},
      },
    } as V4State;

    const unchangedState = await v4(state);

    expect(unchangedState).toEqual(state);
  });

  it('should migrate session mode to public for all async sessions', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session', expires: new Date()}],
          userEvents: [
            {
              type: 'completedSession',
              payload: {
                id: 'migrated-session-id',
                mode: SessionMode.async,
                type: SessionType.private,
              } as CompletedSessionPayload,
              timestamp: new Date().toISOString(),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'not-migrated-session-id-1',
                mode: SessionMode.async,
                type: SessionType.public,
              } as CompletedSessionPayload,
              timestamp: new Date().toISOString(),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'not-migrated-session-id-2',
                mode: SessionMode.live,
                type: SessionType.private,
              } as CompletedSessionPayload,
              timestamp: new Date().toISOString(),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'not-migrated-session-id-3',
                mode: SessionMode.live,
                type: SessionType.public,
              } as CompletedSessionPayload,
              timestamp: new Date().toISOString(),
            },
            {
              type: 'feedback',
              payload: {
                sessionId: 'some-session-id',
              } as FeedbackPayload,
              timestamp: new Date().toISOString(),
            },
          ],
        } as V4UserState,
      },
    };

    const newState = await v4(state);
    expect(newState).toEqual({
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session', expires: expect.any(Date)}],
          userEvents: [
            {
              type: 'completedSession',
              payload: {
                id: 'migrated-session-id',
                mode: SessionMode.async,
                type: SessionType.public,
              },
              timestamp: expect.any(String),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'not-migrated-session-id-1',
                mode: SessionMode.async,
                type: SessionType.public,
              },
              timestamp: expect.any(String),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'not-migrated-session-id-2',
                mode: SessionMode.live,
                type: SessionType.private,
              },
              timestamp: expect.any(String),
            },
            {
              type: 'completedSession',
              payload: {
                id: 'not-migrated-session-id-3',
                mode: SessionMode.live,
                type: SessionType.public,
              },
              timestamp: expect.any(String),
            },
            {
              type: 'feedback',
              payload: {
                sessionId: 'some-session-id',
              },
              timestamp: expect.any(String),
            },
          ],
        },
      },
    });
  });

  it('should not migrate anything if userEvents is undefined', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session', expires: new Date()}],
        } as V4UserState,
      },
    };

    const newState = await v4(state);
    expect(newState).toEqual({
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session', expires: expect.any(Date)}],
        },
      },
    });
  });
});
