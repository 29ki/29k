import {act, renderHook} from '@testing-library/react-hooks';

import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import useUpdateTemple from './useUpdateTemple';

enableFetchMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useUpdateTemple', () => {
  const useTestHook = () => {
    const {setStarted, setEnded} = useUpdateTemple('temple-id');

    return {setStarted, setEnded};
  };

  describe('setStarted', () => {
    it('should make request', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'some-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook());

      await act(async () => {
        await result.current.setStarted();
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('setEnded', () => {
    it('should make request', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'some-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook());

      await act(async () => {
        await result.current.setEnded();
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
