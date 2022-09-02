import {act, renderHook} from '@testing-library/react-hooks';
import {RecoilRoot, useRecoilValue} from 'recoil';
import firestore from '@react-native-firebase/firestore';
import useTemple from './useTemple';
import fetchMock, {enableFetchMocks} from 'jest-fetch-mock';
import {templeAtom} from '../state/state';

enableFetchMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('useTemple', () => {
  const useTestHook = () => {
    const {subscribeTemple, navigateToIndex, setActive} = useTemple();
    const temple = useRecoilValue(templeAtom);

    return {subscribeTemple, temple, navigateToIndex, setActive};
  };

  describe('subscribeTemple', () => {
    it('should subscribe to live session document', async () => {
      const {result} = renderHook(() => useTestHook(), {
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
      const {result} = renderHook(() => useTestHook(), {wrapper: RecoilRoot});

      act(() => {
        result.current.subscribeTemple('test-id');
      });

      expect(result.current.temple).toEqual({id: 'test-id'});
    });

    it('should return unsubscribe method when subscribing', () => {
      const {result} = renderHook(() => useTestHook(), {
        wrapper: RecoilRoot,
      });

      act(() => {
        const unsubscribe = result.current.subscribeTemple('temple-id');
        expect(unsubscribe()).toEqual('unsubscribe-mock');
      });
    });
  });

  describe('navigateToIndex', () => {
    it('should make request', async () => {
      const mock = fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'some-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook(), {
        wrapper: RecoilRoot,
      });

      await act(async () => {
        await result.current.subscribeTemple('temple-id');
        await result.current.navigateToIndex(2);
        expect(mock).toHaveBeenCalledTimes(1);
      });
    });

    it('should do nothing when temple isnt fetched', async () => {
      const mock = fetchMock.mockResponseOnce(
        JSON.stringify({
          yolo: '123',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook(), {
        wrapper: RecoilRoot,
      });

      await act(async () => {
        await result.current.navigateToIndex(4);
        expect(mock).toHaveBeenCalledTimes(0);
      });
    });

    it('should do nothing when index is invalid', async () => {
      const mock = fetchMock.mockResponseOnce(
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
        await result.current.subscribeTemple('temple-id');
        await result.current.navigateToIndex(invalidIndex);
        await result.current.navigateToIndex(invalidIndex2);
        expect(mock).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('setActive', () => {
    it('should make request', async () => {
      const mock = fetchMock.mockResponseOnce(
        JSON.stringify({
          data: 'some-data',
        }),
        {status: 200},
      );

      const {result} = renderHook(() => useTestHook(), {
        wrapper: RecoilRoot,
      });

      await act(async () => {
        await result.current.subscribeTemple('temple-id');
        await result.current.setActive(true);
        expect(mock).toHaveBeenCalledTimes(1);
      });
    });
  });

  it('should do nothing when temple isnt fetched', async () => {
    const mock = fetchMock.mockResponseOnce(
      JSON.stringify({
        data: 'some-data',
      }),
      {status: 200},
    );

    const {result} = renderHook(() => useTestHook(), {
      wrapper: RecoilRoot,
    });

    await act(async () => {
      await result.current.setActive(true);
      expect(mock).toHaveBeenCalledTimes(0);
    });
  });
});
