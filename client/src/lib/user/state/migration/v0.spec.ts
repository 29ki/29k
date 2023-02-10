import {getSession} from '../../../session/api/session';
import v0, {V0State, V0UserState} from './v0';

jest.mock('../../../sessions/api/session');

const getSessionMock = getSession as jest.Mock;

afterEach(jest.clearAllMocks);

describe('v0', () => {
  it('should return state as is if completed sessions is not present', async () => {
    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {someProp: 'test'},
      },
    } as V0State;

    const unchangedState = await v0(state);

    expect(getSessionMock).toHaveBeenCalledTimes(0);
    expect(unchangedState).toEqual(state);
  });

  it('should get all completed sessions', async () => {
    getSessionMock.mockResolvedValue({});
    const state = {
      userState: {
        'some-uid': {
          completedSessions: [{id: 'session-id-1'}, {id: 'session-id-2'}],
        } as V0UserState,
      },
    };

    await v0(state);

    expect(getSessionMock).toHaveBeenCalledTimes(2);
    expect(getSessionMock).toHaveBeenCalledWith('session-id-1');
    expect(getSessionMock).toHaveBeenCalledWith('session-id-2');
  });

  it('should populate completed sessions with relevant session props', async () => {
    getSessionMock.mockResolvedValue({
      hostId: 'host-id',
      exerciseId: 'exercise-id',
      language: 'session-language',
      type: 'session-type',
    });

    const state = {
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session'}],
          completedSessions: [
            {id: 'session-id-1', completedAt: new Date()},
            {id: 'session-id-2', completedAt: new Date()},
          ],
        } as V0UserState,
      },
    };

    const newState = await v0(state);
    expect(newState).toEqual({
      someOtherState: 'foo',
      userState: {
        'some-uid': {
          pinnedSessions: [{id: 'some-session'}],
          completedSessions: [
            {
              id: 'session-id-1',
              hostId: 'host-id',
              contentId: 'exercise-id',
              language: 'session-language',
              type: 'session-type',
              completedAt: expect.any(Date),
            },
            {
              id: 'session-id-2',
              hostId: 'host-id',
              contentId: 'exercise-id',
              language: 'session-language',
              type: 'session-type',
              completedAt: expect.any(Date),
            },
          ],
        },
      },
    });
  });
});
