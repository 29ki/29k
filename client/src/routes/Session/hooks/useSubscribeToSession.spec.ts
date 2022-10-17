import {renderHook} from '@testing-library/react-hooks';
import {RecoilRoot, useRecoilValue} from 'recoil';
import firestore from '@react-native-firebase/firestore';

import {sessionAtom} from '../state/state';
import useSubscribeToSession from './useSubscribeToSession';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSubscribeToSession', () => {
  const useTestHook = () => {
    useSubscribeToSession('session-id');
    const session = useRecoilValue(sessionAtom);

    return session;
  };

  it('should subscribe to live session document', async () => {
    renderHook(() => useTestHook(), {
      wrapper: RecoilRoot,
    });

    expect(firestore().collection).toHaveBeenCalledWith('sessions');

    expect(firestore().collection('sessions').doc).toHaveBeenCalledWith(
      'session-id',
    );
    expect(
      firestore().collection('sessions').doc('session-id').onSnapshot,
    ).toHaveBeenCalled();
  });

  it('should set live content state', () => {
    const {result} = renderHook(() => useTestHook(), {wrapper: RecoilRoot});

    expect(result.current).toEqual({id: 'test-id'});
  });
});
