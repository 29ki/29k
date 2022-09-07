import {act, renderHook} from '@testing-library/react-hooks';
import {RecoilRoot, useRecoilValue} from 'recoil';
import useTemples from './useTemples';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import {isLoadingAtom, templesAtom} from '../state/state';

enableFetchMocks();

afterEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

describe('useTemples', () => {
  describe('fetchTemples', () => {
    const useTestHook = () => {
      const {fetchTemples} = useTemples();
      const temples = useRecoilValue(templesAtom);
      const isLoading = useRecoilValue(isLoadingAtom);

      return {fetchTemples, temples, isLoading};
    };
    it('should fetch temples', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          {id: 'temple-id', url: '/temple-url', name: 'Temple Name'},
        ]),
        {status: 200},
      );
      const {result} = renderHook(() => useTestHook(), {wrapper: RecoilRoot});

      await act(async () => {
        await result.current.fetchTemples();
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(result.current.temples).toEqual([
        {id: 'temple-id', url: '/temple-url', name: 'Temple Name'},
      ]);
    });

    it('should update loading state', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          {id: 'temple-id', url: '/temple-url', name: 'Temple Name'},
        ]),
        {status: 200},
      );
      const {result} = renderHook(() => useTestHook(), {wrapper: RecoilRoot});

      const fetchPromise = act(async () => {
        await result.current.fetchTemples();
      });

      expect(result.current.isLoading).toEqual(true);
      await fetchPromise;
      expect(result.current.isLoading).toEqual(false);
    });
  });

  describe('addTemple', () => {
    it('should add a temple and refetch', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          id: 'temple-id',
          url: '/temple-url',
          name: 'Temple Name',
        }),
        {status: 200},
      );
      const {result} = renderHook(() => useTemples(), {wrapper: RecoilRoot});

      await act(async () => {
        await result.current.addTemple('Temple name');
      });

      expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/temples', {
        body: JSON.stringify({
          name: 'Temple name',
          contentId: '095f9642-73b6-4c9a-ae9a-ea7dea7363f5',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/temples', {
        headers: {'Content-Type': 'application/json'},
      });
    });
  });

  describe('deleteTemple', () => {
    it('should add a temple and refetch', async () => {
      fetchMock.mockResponseOnce('Success', {status: 200});
      const {result} = renderHook(() => useTemples(), {wrapper: RecoilRoot});

      await act(async () => {
        await result.current.deleteTemple('temple-id');
      });

      expect(fetchMock).toHaveBeenCalledWith(
        'some-api-endpoint/temples/temple-id',
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        },
      );

      expect(fetchMock).toHaveBeenCalledWith('some-api-endpoint/temples', {
        headers: {'Content-Type': 'application/json'},
      });
    });
  });
});
