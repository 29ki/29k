import migrate from '.';
import v0 from './v0';
import v1 from './v1';
import v2 from './v2';
import v3 from './v3';
import v4 from './v4';
import v5 from './v5';

jest.mock('./v0', () => jest.fn((state: unknown) => state));
jest.mock('./v1', () => jest.fn((state: unknown) => state));
jest.mock('./v2', () => jest.fn((state: unknown) => state));
jest.mock('./v3', () => jest.fn((state: unknown) => state));
jest.mock('./v4', () => jest.fn((state: unknown) => state));
jest.mock('./v5', () => jest.fn((state: unknown) => state));

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
      expect(v2).toHaveBeenCalledTimes(1);
      expect(v2).toHaveBeenCalledWith(persistedState);
      expect(v3).toHaveBeenCalledTimes(1);
      expect(v3).toHaveBeenCalledWith(persistedState);
      expect(v4).toHaveBeenCalledTimes(1);
      expect(v4).toHaveBeenCalledWith(persistedState);
      expect(v5).toHaveBeenCalledTimes(1);
      expect(v5).toHaveBeenCalledWith(persistedState);
    });
  });

  describe('version 1', () => {
    it('migrates from 1 upwards', async () => {
      await migrate(persistedState, 1);
      expect(v0).toHaveBeenCalledTimes(0);
      expect(v1).toHaveBeenCalledTimes(1);
      expect(v1).toHaveBeenCalledWith(persistedState);
      expect(v2).toHaveBeenCalledTimes(1);
      expect(v2).toHaveBeenCalledWith(persistedState);
      expect(v3).toHaveBeenCalledTimes(1);
      expect(v3).toHaveBeenCalledWith(persistedState);
      expect(v4).toHaveBeenCalledTimes(1);
      expect(v4).toHaveBeenCalledWith(persistedState);
    });
  });

  describe('version 2', () => {
    it('migrates from 2 upwards', async () => {
      await migrate(persistedState, 2);
      expect(v0).toHaveBeenCalledTimes(0);
      expect(v1).toHaveBeenCalledTimes(0);
      expect(v2).toHaveBeenCalledTimes(1);
      expect(v2).toHaveBeenCalledWith(persistedState);
      expect(v3).toHaveBeenCalledTimes(1);
      expect(v3).toHaveBeenCalledWith(persistedState);
      expect(v4).toHaveBeenCalledTimes(1);
      expect(v4).toHaveBeenCalledWith(persistedState);
    });
  });

  describe('version 3', () => {
    it('migrates from 3 upwards', async () => {
      await migrate(persistedState, 3);
      expect(v0).toHaveBeenCalledTimes(0);
      expect(v1).toHaveBeenCalledTimes(0);
      expect(v2).toHaveBeenCalledTimes(0);
      expect(v3).toHaveBeenCalledTimes(1);
      expect(v3).toHaveBeenCalledWith(persistedState);
      expect(v4).toHaveBeenCalledTimes(1);
      expect(v4).toHaveBeenCalledWith(persistedState);
    });
  });

  describe('version 4', () => {
    it('migrates from 4 upwards', async () => {
      await migrate(persistedState, 4);
      expect(v0).toHaveBeenCalledTimes(0);
      expect(v1).toHaveBeenCalledTimes(0);
      expect(v2).toHaveBeenCalledTimes(0);
      expect(v3).toHaveBeenCalledTimes(0);
      expect(v4).toHaveBeenCalledTimes(1);
      expect(v4).toHaveBeenCalledWith(persistedState);
    });
  });

  describe('version 5', () => {
    it('migrates from 5 upwards', async () => {
      await migrate(persistedState, 4);
      expect(v0).toHaveBeenCalledTimes(0);
      expect(v1).toHaveBeenCalledTimes(0);
      expect(v2).toHaveBeenCalledTimes(0);
      expect(v3).toHaveBeenCalledTimes(0);
      expect(v4).toHaveBeenCalledTimes(1);
      expect(v4).toHaveBeenCalledWith(persistedState);
      expect(v5).toHaveBeenCalledTimes(1);
      expect(v5).toHaveBeenCalledWith(persistedState);
    });
  });
});
