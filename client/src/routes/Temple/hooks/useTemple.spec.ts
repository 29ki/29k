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
    const {subscribeTemple} = useTemple();
    const temple = useRecoilValue(templeAtom);

    return {subscribeTemple, temple};
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
});
