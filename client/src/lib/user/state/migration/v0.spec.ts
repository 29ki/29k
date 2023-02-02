import {getSession} from '../../../sessions/api/session';
import v0, {UserState as UserStateV0} from './v0';

jest.mock('../../../sessions/api/session');

const getSessionMock = getSession as jest.Mock;

beforeEach(jest.clearAllMocks);

describe('v0', () => {
  it('should return state as is if completed sessions is not present', async () => {
    const userState = {someProp: 'test'} as UserStateV0;

    const unchangedState = await v0(userState);

    expect(getSessionMock).toHaveBeenCalledTimes(0);
    expect(unchangedState).toBe(userState);
  });

  it('should get all completed sessions', async () => {
    getSessionMock.mockResolvedValue({});
    const userState = {
      completedSessions: [{id: 'session-id-1'}, {id: 'session-id-2'}],
    } as UserStateV0;

    await v0(userState);

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
    const userState = {
      pinnedSessions: [{id: 'some-session'}],
      completedSessions: [
        {id: 'session-id-1', completedAt: new Date()},
        {id: 'session-id-2', completedAt: new Date()},
      ],
    } as UserStateV0;

    const newState = await v0(userState);
    expect(newState).toEqual({
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
    });
  });
});
