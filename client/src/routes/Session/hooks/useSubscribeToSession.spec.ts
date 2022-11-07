import {renderHook} from '@testing-library/react-hooks';
import firestore from '@react-native-firebase/firestore';

import useSessionState from '../state/state';
import useSubscribeToSession from './useSubscribeToSession';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSubscribeToSession', () => {
  const useTestHook = () => {
    useSubscribeToSession('session-id');
    const session = useSessionState(state => state.session);

    return session;
  };

  it('should subscribe to live session document', async () => {
    renderHook(() => useTestHook());

    expect(firestore().collection).toHaveBeenCalledWith('sessions');

    expect(firestore().collection('sessions').doc).toHaveBeenCalledWith(
      'session-id',
    );
    expect(
      firestore().collection('sessions').doc('session-id').onSnapshot,
    ).toHaveBeenCalled();
  });

  it('should set live content state', () => {
    const {result} = renderHook(() => useTestHook());

    expect(result.current).toEqual({id: 'test-id'});
  });
});
