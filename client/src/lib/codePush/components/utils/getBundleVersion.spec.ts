import getBundleVersion from './getBundleVersion';

describe('getBundleVersion', () => {
  it('returns the current Code Push bundle version as a number', async () => {
    const bundleVersion = await getBundleVersion();

    expect(bundleVersion).toBe(1337);
  });
});
