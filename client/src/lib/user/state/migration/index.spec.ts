import migrate from '.';
import v0 from './v0';
import v1 from './v1';

jest.mock('./v0', () => jest.fn((state: unknown) => state));
jest.mock('./v1', () => jest.fn((state: unknown) => state));

afterEach(jest.clearAllMocks);

describe('migrate', () => {
  const persistedState = {
    'some-key': 'some-persisted-state',
  };

  describe('version 0', () => {
    it('migrates from 0 upwards', async () => {
      await migrate(persistedState, 0);
      expect(v0).toHaveBeenCalledTimes(1);
      expect(v0).toHaveBeenCalledWith(persistedState);
      expect(v1).toHaveBeenCalledTimes(1);
      expect(v1).toHaveBeenCalledWith(persistedState);
    });
  });

  describe('version 1', () => {
    it('migrates from 1 upwards', async () => {
      await migrate(persistedState, 1);
      expect(v0).toHaveBeenCalledTimes(0);
      expect(v1).toHaveBeenCalledTimes(1);
      expect(v1).toHaveBeenCalledWith(persistedState);
    });
  });
});
