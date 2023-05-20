/*
 * Copyright (c) 2018-2021 29k International AB
 */

import functionsTest from 'firebase-functions-test';
import * as functions from 'firebase-functions';

import backupHandler from './auth.js';

const storageMock = {
  bucket: jest.fn().mockReturnThis(),
  file: jest.fn().mockReturnThis(),
  createWriteStream: jest.fn().mockReturnThis(),
  on: jest.fn(function (event, callback) {
    if (event === 'finish') {
      callback();
    }
    return this;
  }),
  end: jest.fn(() => Promise.resolve()).mockReturnThis(),
};

const authMock = { listUsers: jest.fn() };

const createUserRecord = (uid) => ({
  toJSON: jest.fn().mockReturnThis(),
  uid,
  email: `${uid}@users.29k.org`,
  emailVerified: false,
  disabled: false,
  metadata: {
    lastSignInTime: 'Tue, 26 Oct 2019 12:41:39 GMT',
    creationTime: 'Tue, 26 Oct 2019 12:41:39 GMT',
  },
  passwordHash: 'some-password-hash',
  passwordSalt: 'some-salty-peanut',
  tokensValidAfterTime: 'Tue, 26 Oct 2019 12:41:39 GMT',
  providerData: [
    {
      uid: 'some-user-id',
      email: 'some-email@email.com',
      providerId: 'horse-shoe',
    },
  ],
});

const createBackupHandler = (FUNCTIONS_BACKUP_BUCKET) =>
  functionsTest().wrap(
    backupHandler({
      auth: () => authMock,
      storage: () => storageMock,
      functions: () => functions,
      env: () => ({ FUNCTIONS_BACKUP_BUCKET }),
    }),
  );

describe('auth backup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should save auth user records to storage', async () => {
    authMock.listUsers.mockResolvedValueOnce({
      users: [createUserRecord('abc')],
    });

    const backup = createBackupHandler('bucket-name');
    const timestamp = Date.now();
    await backup({ timestamp });

    expect(storageMock.file).toHaveBeenCalledWith(`auth/${timestamp}.json`);
    expect(storageMock.createWriteStream).toHaveBeenCalled();
    expect(storageMock.end).toHaveBeenCalledWith(
      JSON.stringify([createUserRecord('abc')]),
    );
  });

  it('paginates correctly', async () => {
    const u = createUserRecord;
    authMock.listUsers
      .mockResolvedValueOnce({ pageToken: 't1', users: [u('a'), u('b')] })
      .mockResolvedValueOnce({ pageToken: 't2', users: [u('c'), u('d')] })
      .mockResolvedValueOnce({ users: [u('e'), u('f')] });

    const backup = createBackupHandler('bucket-name');
    await backup({ timestamp: Date.now() });

    const maxResults = expect.any(Number);
    expect(authMock.listUsers).toHaveBeenCalledTimes(3);
    expect(authMock.listUsers).toHaveBeenCalledWith(maxResults, undefined);
    expect(authMock.listUsers).toHaveBeenCalledWith(maxResults, 't1');
    expect(authMock.listUsers).toHaveBeenCalledWith(maxResults, 't2');

    const json = storageMock.end.mock.calls[0];
    expect(JSON.parse(json)).toMatchObject([
      { uid: 'a' },
      { uid: 'b' },
      { uid: 'c' },
      { uid: 'd' },
      { uid: 'e' },
      { uid: 'f' },
    ]);
  });
});
