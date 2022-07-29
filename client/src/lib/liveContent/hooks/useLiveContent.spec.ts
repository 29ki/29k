import {act, renderHook} from '@testing-library/react-hooks';
import {RecoilRoot, useRecoilValue} from 'recoil';
import firestore from '@react-native-firebase/firestore';

import useLiveContent from './useLiveContent';
import {liveContentStateAtom} from '../state/state';

describe('useLiveContent', () => {
  it('should subscribe to live session document', async () => {
    const {result} = renderHook(() => useLiveContent('some-session-id'), {
      wrapper: RecoilRoot,
    });

    act(() => {
      result.current();
    });
    expect(firestore().collection).toHaveBeenCalledWith(
      'live-content-sessions',
    );

    expect(
      firestore().collection('live-content-sessions').doc,
    ).toHaveBeenCalledWith('some-session-id');
    expect(
      firestore().collection('live-content-sessions').doc('some-session-id')
        .onSnapshot,
    ).toHaveBeenCalled();
  });

  it('should set live content state', () => {
    const {result} = renderHook(
      () => {
        const subscribe = useLiveContent('some-session-id');
        const liveContentState = useRecoilValue(liveContentStateAtom);
        return {subscribe, liveContentState};
      },
      {wrapper: RecoilRoot},
    );

    act(() => {
      result.current.subscribe();
    });

    expect(result.current.liveContentState).toEqual({id: 'test-id'});
  });

  it('should return unsubscribe method when subscribing', () => {
    const {result} = renderHook(() => useLiveContent('some-session-id'), {
      wrapper: RecoilRoot,
    });

    act(() => {
      const unsubscribe = result.current();
      expect(unsubscribe()).toEqual('unsubscribe-mock');
    });
  });
});
