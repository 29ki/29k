import {renderHook} from '@testing-library/react-hooks';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import useSessionState from '../state/state';
import useSessions from '../../Sessions/hooks/useSessions';
jest.mock('../../Sessions/hooks/useSessions');

const mockUseSessions = useSessions as jest.Mock;

import useSubscribeToSession from './useSubscribeToSession';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSubscribeToSession', () => {
  const fetchSessionsMock = jest.fn();
  mockUseSessions.mockReturnValue({fetchSessions: fetchSessionsMock});
  const navigation = useNavigation();

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

  it('should handle when session does not exist', () => {
    (
      firestore().collection('sessions').doc().onSnapshot as jest.Mock
    ).mockImplementationOnce(cb => {
      cb({exists: false, data: () => undefined});
    });

    const {result} = renderHook(() => useTestHook());
    expect(result.current).toBe(null);

    expect(fetchSessionsMock).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Sessions');
    expect(navigation.navigate).toHaveBeenCalledWith('SessionUnavailableModal');
  });

  it('should handle when session has ended', () => {
    (
      firestore().collection('sessions').doc().onSnapshot as jest.Mock
    ).mockImplementationOnce(cb => {
      cb({exists: true, data: () => ({ended: true})});
    });

    const {result} = renderHook(() => useTestHook());
    expect(result.current).toBe(null);

    expect(fetchSessionsMock).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Sessions');
    expect(navigation.navigate).toHaveBeenCalledWith('SessionUnavailableModal');
  });
});
