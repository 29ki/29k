import {renderHook} from '@testing-library/react-hooks';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import useSessionState from '../state/state';
import useSessions from '../../Sessions/hooks/useSessions';
jest.mock('../../Sessions/hooks/useSessions');
jest.mock('./useSubscribeToSession');

const mockUseSessions = useSessions as jest.Mock;
const mockuseSubscribeToSession = useSubscribeToSession as jest.Mock;
const mockUseIsFocused = useIsFocused as jest.Mock;

import useSubscribeToSessionIfFocused from './useSusbscribeToSessionIfFocused';
import useSubscribeToSession from './useSubscribeToSession';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSubscribeToSession', () => {
  const fetchSessionsMock = jest.fn();
  mockUseSessions.mockReturnValue({fetchSessions: fetchSessionsMock});

  const mockSubscribeToSession = jest.fn();
  mockuseSubscribeToSession.mockReturnValue(mockSubscribeToSession);

  const navigation = useNavigation();

  const useTestHook = ({exitOnEnded = true} = {}) => {
    useSubscribeToSessionIfFocused('session-id', {exitOnEnded});
    const session = useSessionState(state => state.session);

    return session;
  };

  it('should subscribe to live session document', async () => {
    mockUseIsFocused.mockReturnValueOnce(true);
    renderHook(() => useTestHook());

    expect(mockSubscribeToSession).toHaveBeenCalledTimes(1);
    expect(mockSubscribeToSession).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should set live content state', () => {
    mockUseIsFocused.mockReturnValueOnce(true);
    mockSubscribeToSession.mockImplementation(cb =>
      cb({data: () => ({id: 'test-id'}), exists: true}),
    );

    const {result} = renderHook(() => useTestHook());

    expect(result.current).toEqual({id: 'test-id'});
  });

  it('should handle when session does not exist', () => {
    mockUseIsFocused.mockReturnValueOnce(true);
    mockSubscribeToSession.mockImplementationOnce(cb =>
      cb({data: () => undefined, exists: false}),
    );

    const {result} = renderHook(() => useTestHook());
    expect(result.current).toBe(null);

    expect(fetchSessionsMock).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Sessions');
    expect(navigation.navigate).toHaveBeenCalledWith('SessionUnavailableModal');
  });

  it('should handle when session has ended', () => {
    mockUseIsFocused.mockReturnValueOnce(true);
    mockSubscribeToSession.mockImplementationOnce(cb =>
      cb({data: () => ({ended: true}), exists: true}),
    );

    const {result} = renderHook(() => useTestHook());
    expect(result.current).toBe(null);

    expect(fetchSessionsMock).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('Sessions');
    expect(navigation.navigate).toHaveBeenCalledWith('SessionUnavailableModal');
  });

  it('should do nothing when session has ended', () => {
    mockUseIsFocused.mockReturnValueOnce(true);
    mockSubscribeToSession.mockImplementationOnce(cb =>
      cb({data: () => ({ended: true}), exists: true}),
    );

    renderHook(() => useTestHook({exitOnEnded: false}));

    expect(fetchSessionsMock).toHaveBeenCalledTimes(0);
    expect(navigation.navigate).toHaveBeenCalledTimes(0);
  });

  it('should unsubscribe when unfocused', async () => {
    mockUseIsFocused.mockReturnValueOnce(true);
    const mockUnsubscribe = jest.fn();
    mockSubscribeToSession.mockImplementationOnce(cb => {
      cb({data: () => ({id: 'some-data'}), exists: true});
      return mockUnsubscribe;
    });

    const {rerender} = renderHook(() => useTestHook());

    expect(mockSubscribeToSession).toHaveBeenCalledTimes(1);

    mockUseIsFocused.mockReturnValueOnce(false);

    rerender();

    expect(mockSubscribeToSession).toHaveBeenCalledTimes(1); // Total number of calls (meaning doesn't call it again)
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
  });

  it('should not subscribe when unfocused', () => {
    mockUseIsFocused.mockReturnValueOnce(false);
    mockSubscribeToSession.mockImplementationOnce(cb =>
      cb({data: () => ({id: 'some-data'}), exists: true}),
    );
    const mockUnsubscribe = jest.fn();
    mockSubscribeToSession.mockReturnValueOnce(mockUnsubscribe);

    renderHook(() => useTestHook());

    expect(mockSubscribeToSession).toHaveBeenCalledTimes(0);
  });
});
