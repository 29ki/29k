import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot, useRecoilValue} from 'recoil';
import firestore from '@react-native-firebase/firestore';

import {templeAtom} from '../state/state';
import useSubscribeToTemple from './useSubscribeToTemple';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSubscribeToTemple', () => {
  const useTestHook = () => {
    useSubscribeToTemple('temple-id');
    const temple = useRecoilValue(templeAtom);

    return temple;
  };

  it('should subscribe to live session document', async () => {
    renderHook(() => useTestHook(), {
      wrapper: RecoilRoot,
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

    expect(result.current).toEqual({id: 'test-id'});
  });
});
