import {act, renderHook} from '@testing-library/react-hooks';
import {RecoilRoot} from 'recoil';
import firestore from '@react-native-firebase/firestore';
import useTemples from './useTemples';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';

enableFetchMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useTemples', () => {
  describe('subscribeTemple', () => {
    it('should subscribe to live session document', async () => {
      const {result} = renderHook(() => useTemples(), {
        wrapper: RecoilRoot,
      });

      act(() => {
        result.current.subscribeTemple('temple-id');
      });
      expect(firestore().collection).toHaveBeenCalledWith('temples');

      expect(firestore().collection('temples').doc).toHaveBeenCalledWith(
        'temple-id',
      );
      expect(
        firestore().collection('temples').doc('temple-id').onSnapshot,
      ).toHaveBeenCalled();
    });

    it('should set live content state', () => {
      const {result} = renderHook(() => useTemples(), {wrapper: RecoilRoot});

      act(() => {
        result.current.subscribeTemple('test-id');
      });

      expect(result.current.contentState).toEqual({id: 'test-id'});
    });

    it('should return unsubscribe method when subscribing', () => {
      const {result} = renderHook(() => useTemples(), {
        wrapper: RecoilRoot,
      });

      act(() => {
        const unsubscribe = result.current.subscribeTemple('temple-id');
        expect(unsubscribe()).toEqual('unsubscribe-mock');
      });
    });
  });

  describe('fetchTemples', () => {
    it('should fetch temples', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          {id: 'temple-id', url: '/temple-url', name: 'Temple Name'},
        ]),
        {status: 200},
      );
      const {result} = renderHook(() => useTemples(), {wrapper: RecoilRoot});

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
      const {result} = renderHook(() => useTemples(), {wrapper: RecoilRoot});

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

      const promise = act(async () => {
        await result.current.addTemple('Temple name');
      });

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:5001/demo-29k-cupcake/europe-west1/temple',
        {
          body: JSON.stringify({name: 'Temple name'}),
          method: 'POST',
        },
      );

      await promise;

      expect(fetchMock).toHaveBeenCalledWith(
        'http://localhost:5001/demo-29k-cupcake/europe-west1/temple',
      );
    });
  });
});
