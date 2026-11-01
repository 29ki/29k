const codePush = jest.fn(() => Component => Component);

codePush.CheckFrequency = {
  ON_APP_START: 0,
  ON_APP_RESUME: 1,
  MANUAL: 2,
};

codePush.SyncStatus = {
  UP_TO_DATE: 0,
  UPDATE_INSTALLED: 1,
  UPDATE_IGNORED: 2,
  UNKNOWN_ERROR: 3,
  SYNC_IN_PROGRESS: 4,
  CHECKING_FOR_UPDATE: 5,
  AWAITING_USER_ACTION: 6,
  DOWNLOADING_PACKAGE: 7,
  INSTALLING_UPDATE: 8,
};

codePush.InstallMode = {
  ON_NEXT_RESTART: 1337,
};

codePush.sync = jest.fn();
codePush.restartApp = jest.fn();
codePush.clearUpdates = jest.fn();
codePush.getUpdateMetadata = jest.fn(() =>
  Promise.resolve({label: 'v1337', description: 'decription'}),
);

export default codePush;
