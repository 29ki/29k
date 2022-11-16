import {renderHook} from '@testing-library/react-hooks';
import firestore from '@react-native-firebase/firestore';
import useSessionState from '../state/state';

import useSubscribeToSession from './useSubscribeToSession';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSubscribeToSession', () => {
  const mockCallback = jest.fn();

  const useTestHook = () => {
    const subscribeToSession = useSubscribeToSession('session-id');
    const session = useSessionState(state => state.session);

    subscribeToSession(mockCallback);
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
    ).toHaveBeenCalledWith(mockCallback, expect.any(Function));
    expect(mockCallback).toHaveBeenCalledWith({
      data: expect.any(Function),
      exists: true,
    });
  });
});
