import {act, renderHook} from '@testing-library/react-hooks';

import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import useJoinSession from './useJoinSession';

enableFetchMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useJoinSession', () => {
  const useTestHook = () => {
    const joinSession = useJoinSession();

    return {joinSession};
  };

  describe('setStarted', () => {
    it('should make request and return its data', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'some-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook());

      await act(async () => {
        const session = await result.current.joinSession(123456);
        expect(session).toEqual({data: 'some-data'});
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it('should reject when request fails', async () => {
      fetchMock.mockResponseOnce('fail', {status: 500});

      const {result} = renderHook(() => useTestHook());

      await act(async () => {
        await expect(result.current.joinSession(123456)).rejects.toEqual(
          Error('Could not join session'),
        );
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
