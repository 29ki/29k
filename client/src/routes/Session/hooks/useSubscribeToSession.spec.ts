import {renderHook} from '@testing-library/react-hooks';
import firestore from '@react-native-firebase/firestore';
import useSessionState from '../state/state';

import useSubscribeToSession from './useSubscribeToSession';
import {
  getSession,
  getSessionState,
} from '../../../../../shared/src/modelUtils/session';

jest.mock('../../../../../shared/src/modelUtils/session', () => ({
  getSessionState: jest.fn().mockReturnValue('get-session-state-result'),
  getSession: jest.fn().mockReturnValue('get-session-result'),
}));

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

    const sessionDoc = firestore().collection('sessions').doc('session-id');
    const stateDoc = sessionDoc.collection('state').doc('session-id');

    expect(firestore().collection).toHaveBeenCalledWith('sessions');
    expect(firestore().collection('sessions').doc).toHaveBeenCalledWith(
      'session-id',
    );
    expect(sessionDoc.get).toHaveBeenCalledTimes(1);
    expect(sessionDoc.collection).toHaveBeenCalledWith('state');
    expect(sessionDoc.collection('state').doc).toHaveBeenCalledWith(
      'session-id',
    );
    expect(stateDoc.onSnapshot).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
    await new Promise(process.nextTick);

    expect(getSessionState).toHaveBeenCalledWith({id: 'test-id'});
    expect(getSession).toHaveBeenCalledWith({id: 'test-id'});
    expect(mockCallback).toHaveBeenCalledWith(
      'get-session-state-result',
      'get-session-result',
    );
  });
});
