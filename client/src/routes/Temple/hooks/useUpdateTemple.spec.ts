import {act, renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';

import useUpdateTemple from './useUpdateTemple';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import {ContentSlide} from '../../../../../shared/src/types/Content';

enableFetchMocks();

const mockContent = [
  {type: 'facilitator'},
  {type: 'text', content: {heading: 'some heading'}},
  {type: 'video', content: {heading: 'some heading', source: 'some://source'}},
] as ContentSlide[];

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useUpdateTemple', () => {
  const useTestHook = () => {
    const {navigateToIndex, setActive, setPlaying} =
      useUpdateTemple('temple-id');

    return {navigateToIndex, setActive, setPlaying};
  };

  describe('navigateToIndex', () => {
    it('should make request', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'some-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook(), {
        wrapper: RecoilRoot,
      });

      await act(async () => {
        await result.current.navigateToIndex({index: 2, content: mockContent});
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when temple isnt fetched', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          yolo: '123',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook(), {
        wrapper: RecoilRoot,
      });

      await act(async () => {
        await result.current.navigateToIndex({index: 4, content: mockContent});
      });

      expect(fetchMock).toHaveBeenCalledTimes(0);
    });

    it('should do nothing when index is invalid', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          yolo: '123',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook(), {
        wrapper: RecoilRoot,
      });

      await act(async () => {
        const invalidIndex = 4000;
        const invalidIndex2 = -1;
        await result.current.navigateToIndex({
          index: invalidIndex,
          content: mockContent,
        });
        await result.current.navigateToIndex({
          index: invalidIndex2,
          content: mockContent,
        });
      });

      expect(fetchMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('setActive', () => {
    it('should make request', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'somye-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook(), {
        wrapper: RecoilRoot,
      });

      await act(async () => {
        await result.current.setActive(true);
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
