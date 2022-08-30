import {getBundleVersion, getDeviceInfo} from './system';

describe('getBundleVersion', () => {
  it('returns the current Code Push bundle version as a number', async () => {
    const bundleVersion = await getBundleVersion();

    expect(bundleVersion).toBe(1337);
  });
});

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
