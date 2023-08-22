import {renderHook} from '@testing-library/react-hooks';
import {VolumeManager} from 'react-native-volume-manager';
import useAdjustVolume from './useAdjustVolume';

jest.mock('react-native', () => {
  const reactNative = jest.requireActual('react-native');
  reactNative.Platform.OS = 'android';
  return reactNative;
});

const mockedGetVolume = jest.mocked(VolumeManager.getVolume);
const mockedSetVolume = jest.mocked(VolumeManager.setVolume);

describe('useAdjustVolume', () => {
  it('should adjust volume when music and call are not same', async () => {
    mockedGetVolume.mockResolvedValueOnce({
      volume: 1,
      call: 1,
      music: 0,
    });

    const {result} = renderHook(() => useAdjustVolume());

    await result.current();

    expect(mockedSetVolume).toHaveBeenCalledWith(1, {
      type: 'music',
      showUI: false,
    });
  });

  it('should adjust volume when music is undefined', async () => {
    mockedGetVolume.mockResolvedValueOnce({
      volume: 1,
      call: 1,
      music: undefined,
    });

    const {result} = renderHook(() => useAdjustVolume());

    await result.current();

    expect(mockedSetVolume).toHaveBeenCalledWith(1, {
      type: 'music',
      showUI: false,
    });
  });

  it('should adjust volume to default value when both music and call is undefined', async () => {
    mockedGetVolume.mockResolvedValueOnce({
      volume: 1,
      call: undefined,
      music: undefined,
    });

    const {result} = renderHook(() => useAdjustVolume());

    await result.current();

    expect(mockedSetVolume).toHaveBeenCalledWith(0.5, {
      type: 'music',
      showUI: false,
    });
  });
});
