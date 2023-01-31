import migrate from '.';
import v0 from './v0';

jest.mock('./v0');

const v0Mock = v0 as jest.Mock;

describe('migrate', () => {
  describe('version === 0', () => {
    const persistedState = {
      userState: {
        ['user-id-1']: {
          completedSessions: [{id: 'session-id-1'}, {id: 'session-id-2'}],
        },
        ['user-id-2']: {
          completedSessions: [{id: 'session-id-3'}, {id: 'session-id-4'}],
        },
      },
    };

    it('should migrate every user id', async () => {
      await migrate(persistedState, 0);
      expect(v0).toHaveBeenCalledTimes(2);
      expect(v0).toHaveBeenCalledWith({
        completedSessions: [{id: 'session-id-1'}, {id: 'session-id-2'}],
      });
      expect(v0).toHaveBeenCalledWith({
        completedSessions: [{id: 'session-id-3'}, {id: 'session-id-4'}],
      });
    });

    it('should return new persisted state with every user id', async () => {
      v0Mock.mockResolvedValueOnce('new-user-state-1');
      v0Mock.mockResolvedValueOnce('new-user-state-2');

      const newState = await migrate(persistedState, 0);

      expect(newState).toEqual({
        userState: {
          'user-id-1': 'new-user-state-1',
          'user-id-2': 'new-user-state-2',
        },
      });
    });
  });
});
