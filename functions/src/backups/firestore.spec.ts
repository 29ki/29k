/*
 * Copyright (c) 2018-2021 29k International AB
 */

import functionsTest from 'firebase-functions-test';
import * as functions from 'firebase-functions';

const FirestoreAdminClientMock = {
  databasePath: jest.fn(() => 'some-path'),
  exportDocuments: jest.fn(),
};

const GoogleAuthMock = {
  getProjectId: jest.fn(() => 'some-project-id'),
};

const FirestoreMock = {
  listCollections: jest
    .fn()
    .mockResolvedValue([
      { id: 'scheduler' },
      { id: 'some-collection-id' },
      { id: 'some-other-collection-id' },
    ]),
};

const servicesMock = (env) => ({
  firestore: () => FirestoreMock,
  firestoreAdmin: () => FirestoreAdminClientMock,
  functions: () => functions,
  env: () => env,
  googleAuth: () => GoogleAuthMock,
});

import backupHandler from './firestore.js';

const createBackupHandler = (env) =>
  functionsTest().wrap(backupHandler(servicesMock(env)));

describe('backup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start backup process', async () => {
    const backup = createBackupHandler({
      FUNCTIONS_BACKUP_BUCKET: 'bucket-name',
    });

    await backup({ timestamp: '2019-04-09T07:56:12.975Z' });

    expect(FirestoreAdminClientMock.databasePath).toHaveBeenCalledTimes(1);
    expect(FirestoreAdminClientMock.databasePath).toHaveBeenCalledWith(
      'some-project-id',
      '(default)',
    );
    expect(FirestoreAdminClientMock.exportDocuments).toHaveBeenCalledTimes(1);
    expect(FirestoreAdminClientMock.exportDocuments).toHaveBeenCalledWith({
      name: 'some-path',
      outputUriPrefix: 'gs://bucket-name/firestore/2019-04-09T07:56:12.975Z',
      collectionIds: ['some-collection-id', 'some-other-collection-id'],
    });
  });

  it('should throw export error', async () => {
    FirestoreAdminClientMock.exportDocuments.mockRejectedValueOnce(
      new Error('oh noes'),
    );
    const backup = createBackupHandler({ FUNCTIONS_BACKUP_BUCKET: '' });

    await expect(backup({ timestamp: '' })).rejects.toThrow('oh noes');
  });
});
