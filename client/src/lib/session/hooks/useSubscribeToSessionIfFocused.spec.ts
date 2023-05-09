import {renderHook} from '@testing-library/react-hooks';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import useSessionState from '../state/state';
import useSessions from '../../sessions/hooks/useSessions';
import useSubscribeToSessionIfFocused from './useSubscribeToSessionIfFocused';
import useSubscribeToSession from './useSubscribeToSession';
import useGetExerciseById from '../../content/hooks/useGetExerciseById';
import {LiveSessionType} from '../../../../../shared/src/schemas/Session';
import {Exercise} from '../../../../../shared/src/types/generated/Exercise';

jest.mock('../../../lib/sessions/hooks/useSessions');
jest.mock('./useSubscribeToSession');
jest.mock('../../content/hooks/useGetExerciseById');

const mockUseSessions = jest.mocked(useSessions);
const mockuseSubscribeToSession = jest.mocked(useSubscribeToSession);
const mockUseIsFocused = jest.mocked(useIsFocused);
const mockUseGetExerciseById = jest.mocked(useGetExerciseById);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSubscribeToSessionIfFocused', () => {
  const fetchSessionsMock = jest.fn();
  mockUseSessions.mockReturnValue({
    fetchSessions: fetchSessionsMock,
  } as any);

  const mockSubscribeToSession = jest.fn();
  mockuseSubscribeToSession.mockReturnValue(mockSubscribeToSession);

  const mockGetExerciseById = jest.fn().mockReturnValue({
    name: 'Some Exercise',
    slides: [{type: 'instruction'}, {type: 'content'}],
  } as Exercise);
  mockUseGetExerciseById.mockReturnValue(mockGetExerciseById);

  const navigation = useNavigation();

  const mockSession = {
    id: 'session-id',
    exerciseId: 'some-exercise-id',
    language: 'sv',
  } as LiveSessionType;

  const useTestHook = ({exitOnEnded = true} = {}) => {
    useSubscribeToSessionIfFocused(mockSession, {
      exitOnEnded,
    });
    const sessionState = useSessionState(state => state.sessionState);
    const session = useSessionState(state => state.liveSession);
    const exercise = useSessionState(state => state.exercise);

    return {sessionState, session, exercise};
  };

  it('should subscribe to live session document', async () => {
    mockUseIsFocused.mockReturnValueOnce(true);
    renderHook(() => useTestHook());

    expect(mockSubscribeToSession).toHaveBeenCalledTimes(1);
    expect(mockSubscribeToSession).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should set session state on mount', () => {
    const {result} = renderHook(() => useTestHook());

    expect(result.current).toEqual(
      expect.objectContaining({
        session: {
          id: 'session-id',
          exerciseId: 'some-exercise-id',
          language: 'sv',
        },
      }),
    );
  });

  it('should set session exercise state on mount, keeping only live slides', () => {
    const {result} = renderHook(() => useTestHook());

    expect(result.current).toEqual(
      expect.objectContaining({
        exercise: {
          name: 'Some Exercise',
          slides: [{type: 'content'}],
        },
      }),
    );
  });

  it('should set current session state', () => {
    mockUseIsFocused.mockReturnValueOnce(true);
    mockSubscribeToSession.mockImplementation(cb =>
      cb({id: 'session-id', someStateProp: 'test'}),
    );

    const {result} = renderHook(() => useTestHook());

    expect(result.current).toEqual(
      expect.objectContaining({
        sessionState: {id: 'session-id', someStateProp: 'test'},
      }),
    );
  });

  it('should handle when session does not exist', () => {
    mockUseIsFocused.mockReturnValueOnce(true);
    mockSubscribeToSession.mockImplementationOnce(cb => cb(undefined));

    const {result} = renderHook(() => useTestHook());
    expect(result.current).toEqual({
      sessionState: null,
      session: null,
      exercise: null,
    });

    expect(fetchSessionsMock).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('HomeStack');
    expect(navigation.navigate).toHaveBeenCalledWith('SessionUnavailableModal');
  });

  it('should handle when session has ended', () => {
    mockUseIsFocused.mockReturnValueOnce(true);
    mockSubscribeToSession.mockImplementationOnce(cb => cb({ended: true}));

    const {result} = renderHook(() => useTestHook());
    expect(result.current).toEqual({
      session: null,
      sessionState: null,
      exercise: null,
    });

    expect(fetchSessionsMock).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('HomeStack');
    expect(navigation.navigate).toHaveBeenCalledWith('SessionUnavailableModal');
  });

  it('should do nothing when session has ended', () => {
    mockUseIsFocused.mockReturnValueOnce(true);
    mockSubscribeToSession.mockImplementationOnce(cb => cb({ended: true}, {}));

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
