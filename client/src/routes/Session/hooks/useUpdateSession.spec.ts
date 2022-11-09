import {act, renderHook} from '@testing-library/react-hooks';

import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import useUpdateSession from './useUpdateSession';

enableFetchMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useUpdateSession', () => {
  const useTestHook = () => {
    const {setStarted, setEnded} = useUpdateSession('session-id');

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
});
