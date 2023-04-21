import {getDeviceInfo} from './system';

describe('getDeviceInfo', () => {
  it('returns device info', async () => {
    const deviceInfo = await getDeviceInfo();

    expect(deviceInfo).toEqual({
      bundleVersion: 1337,
      gitCommit: 'some-git-hash',
      model: 'some-model',
      nativeVersion: 'some-version',
      os: 'some-os',
      osVersion: 'some-os-version',
    });
  });
});
