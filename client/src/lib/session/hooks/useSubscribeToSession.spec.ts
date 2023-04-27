import {renderHook} from '@testing-library/react-hooks';
import firestore from '@react-native-firebase/firestore';

import useSubscribeToSession from './useSubscribeToSession';
import {
  LiveSession,
  LiveSessionSchema,
} from '../../../../../shared/src/schemas/Session';

jest.mock('../../../../../shared/src/schemas/Session');
const mockeLiveSessionSchema = jest.mocked(LiveSessionSchema);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSubscribeToSession', () => {
  const mockCallback = jest.fn();

  const useTestHook = () => {
    const subscribeToSession = useSubscribeToSession('session-id');
    subscribeToSession(mockCallback);
  };

  it('should subscribe to live session document', async () => {
    mockeLiveSessionSchema.validateSync.mockReturnValueOnce(
      'get-session-state-result' as unknown as LiveSession,
    );
    renderHook(() => useTestHook());

    const sessionDoc = firestore().collection('sessions').doc('session-id');
    const stateDoc = sessionDoc.collection('state').doc('session-id');

    expect(firestore().collection).toHaveBeenCalledWith('sessions');
    expect(firestore().collection('sessions').doc).toHaveBeenCalledWith(
      'session-id',
    );
    expect(sessionDoc.collection).toHaveBeenCalledWith('state');
    expect(sessionDoc.collection('state').doc).toHaveBeenCalledWith(
      'session-id',
    );
    expect(stateDoc.onSnapshot).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Function),
    );
    await new Promise(process.nextTick);

    expect(mockeLiveSessionSchema.validateSync).toHaveBeenCalledWith({
      id: 'test-id',
    });
    expect(mockCallback).toHaveBeenCalledWith('get-session-state-result');
  });
});
