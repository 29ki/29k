import {renderHook} from '@testing-library/react-hooks';
import {
  LiveSession,
  SessionState,
} from '../../../../../shared/src/types/Session';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useSessionState from '../state/state';
import useSessionSlideState from './useSessionSlideState';

jest.mock('../../../lib/content/hooks/useExerciseById', () => jest.fn());

const mockUseExerciseById = useExerciseById as jest.Mock;

describe('useSessionSlideState', () => {
  it('should return null if no exercise exists', () => {
    mockUseExerciseById.mockReturnValueOnce(null);
    useSessionState.setState({
      liveSession: {
        exerciseId: 'some-content-id',
        id: 'test',
      } as LiveSession,
    });

    const {result} = renderHook(() => useSessionSlideState());

    expect(result.current).toBe(null);
  });

  it('should return null if no session exists', () => {
    mockUseExerciseById.mockReturnValueOnce({});
    useSessionState.setState({
      liveSession: null,
    });
    const {result} = renderHook(() => useSessionSlideState());

    expect(result.current).toBe(null);
  });

  it('should return slide state', () => {
    mockUseExerciseById.mockReturnValueOnce({
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    });
    useSessionState.setState({
      liveSession: {
        exerciseId: 'some-content',
      } as LiveSession,
      sessionState: {
        index: 1,
      } as SessionState,
    });

    const {result} = renderHook(() => useSessionSlideState());

    expect(result.current).toEqual({
      index: 1,
      current: {type: 'slide-2'},
      next: {type: 'slide-3'},
      previous: {type: 'slide-1'},
    });
  });

  it('should memoize return', () => {
    const exercise = {
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    };
    mockUseExerciseById.mockReturnValueOnce(exercise);
    useSessionState.setState({
      sessionState: {
        index: 1,
      } as SessionState,
    });

    const {result, rerender} = renderHook(() => useSessionSlideState());

    mockUseExerciseById.mockReturnValueOnce(exercise);
    rerender();

    expect(result.all.length).toBe(2);
    expect(result.all[0]).toBe(result.all[1]);
  });

  it('should return only current slide', () => {
    mockUseExerciseById.mockReturnValueOnce({
      slides: [{type: 'slide-1'}],
    });
    useSessionState.setState({
      liveSession: {exerciseId: 'some-content'} as LiveSession,
      sessionState: {index: 0} as SessionState,
    });

    const {result} = renderHook(() => useSessionSlideState());

    expect(result.current).toEqual({
      index: 0,
      current: {type: 'slide-1'},
      next: undefined,
      previous: undefined,
    });
  });
});
