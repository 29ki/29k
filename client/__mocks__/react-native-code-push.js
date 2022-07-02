const codePushMock = {
  SyncStatus: {
    UP_TO_DATE: 0,
    UPDATE_INSTALLED: 1,
    UPDATE_IGNORED: 2,
    UNKNOWN_ERROR: 3,
    SYNC_IN_PROGRESS: 4,
    CHECKING_FOR_UPDATE: 5,
    AWAITING_USER_ACTION: 6,
    DOWNLOADING_PACKAGE: 7,
    INSTALLING_UPDATE: 8,
  },
  InstallMode: {
    ON_NEXT_RESTART: 1337,
  },
  sync: jest.fn(),
  restartApp: jest.fn(),
  clearUpdates: jest.fn(),
  getUpdateMetadata: jest.fn(() =>
    Promise.resolve({label: 'v1337', description: 'decription'}),
  ),
};

export default codePushMock;
