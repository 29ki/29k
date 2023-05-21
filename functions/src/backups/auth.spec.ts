import {authBackup} from './auth';

jest.mock('@sentry/node');

const storageMock = {
  bucket: jest.fn().mockReturnThis(),
  file: jest.fn().mockReturnThis(),
  createWriteStream: jest.fn().mockReturnThis(),
  on: function (event: string, callback: () => void) {
    if (event === 'finish') {
      callback();
    }
    return this;
  },
  end: jest.fn(() => Promise.resolve()).mockReturnThis(),
};
jest.mock('firebase-admin/storage', () => ({
  getStorage: jest.fn(() => storageMock),
}));

const authMock = {listUsers: jest.fn()};
jest.mock('firebase-admin/auth', () => ({getAuth: jest.fn(() => authMock)}));

const createUserRecord = (uid: string) => ({
  toJSON: jest.fn().mockReturnThis(),
  uid,
});

describe('auth backup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save auth user records to storage', async () => {
    authMock.listUsers.mockResolvedValueOnce({
      users: [createUserRecord('abc')],
    });

    const scheduleTime = Date.now().toString();
    await authBackup.run({scheduleTime});

    expect(storageMock.file).toHaveBeenCalledWith(`auth/${scheduleTime}.json`);
    expect(storageMock.createWriteStream).toHaveBeenCalled();
    expect(storageMock.end).toHaveBeenCalledWith(
      JSON.stringify([createUserRecord('abc')]),
    );
  });

  it('paginates correctly', async () => {
    authMock.listUsers
      .mockResolvedValueOnce({
        pageToken: 't1',
        users: [createUserRecord('a'), createUserRecord('b')],
      })
      .mockResolvedValueOnce({
        pageToken: 't2',
        users: [createUserRecord('c'), createUserRecord('d')],
      })
      .mockResolvedValueOnce({
        users: [createUserRecord('e'), createUserRecord('f')],
      });

    await authBackup.run({scheduleTime: Date.now().toString()});

    const maxResults = expect.any(Number);
    expect(authMock.listUsers).toHaveBeenCalledTimes(3);
    expect(authMock.listUsers).toHaveBeenCalledWith(maxResults, undefined);
    expect(authMock.listUsers).toHaveBeenCalledWith(maxResults, 't1');
    expect(authMock.listUsers).toHaveBeenCalledWith(maxResults, 't2');

    expect(storageMock.end).toHaveBeenCalledWith(
      '[{"uid":"a"},{"uid":"b"},{"uid":"c"},{"uid":"d"},{"uid":"e"},{"uid":"f"}]',
    );
  });
});
