jest.mock('@sentry/node');

const googleAuthMock = {
  getProjectId: jest.fn(() => 'some-project-id'),
};
jest.mock('google-auth-library', () => ({
  GoogleAuth: jest.fn(() => googleAuthMock),
}));

const firestoreAdminClientMock = {
  databasePath: jest.fn(() => 'some-path'),
  exportDocuments: jest.fn(),
};
const firestoreMock = {
  listCollections: jest
    .fn()
    .mockResolvedValue([
      {id: 'some-collection-id'},
      {id: 'some-other-collection-id'},
    ]),
};
jest.mock('firebase-admin/firestore', () => ({
  v1: {FirestoreAdminClient: jest.fn(() => firestoreAdminClientMock)},
  getFirestore: () => firestoreMock,
}));

import {firestoreBackup} from './firestore';

describe('backup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should start backup process', async () => {
    await firestoreBackup.run({scheduleTime: '2019-04-09T07:56:12.975Z'});

    expect(firestoreAdminClientMock.databasePath).toHaveBeenCalledTimes(1);
    expect(firestoreAdminClientMock.databasePath).toHaveBeenCalledWith(
      'some-project-id',
      '(default)',
    );
    expect(firestoreAdminClientMock.exportDocuments).toHaveBeenCalledTimes(1);
    expect(firestoreAdminClientMock.exportDocuments).toHaveBeenCalledWith({
      name: 'some-path',
      outputUriPrefix:
        'gs://some-backups-bucket/firestore/2019-04-09T07:56:12.975Z',
      collectionIds: ['some-collection-id', 'some-other-collection-id'],
    });
  });

  it('should throw export error', async () => {
    firestoreAdminClientMock.exportDocuments.mockRejectedValueOnce(
      new Error('oh noes'),
    );

    await expect(firestoreBackup.run({scheduleTime: ''})).rejects.toThrow(
      'oh noes',
    );
  });
});
