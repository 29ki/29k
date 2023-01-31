import {renderHook} from '@testing-library/react-hooks';
import {
  AsyncSession,
  Session,
  SessionState,
} from '../../../../../shared/src/types/Session';
import useExerciseById from '../../../lib/content/hooks/useExerciseById';
import useSessionState from '../state/state';
import useSessionExercise from './useSessionExercise';

jest.mock('../../../lib/content/hooks/useExerciseById', () => jest.fn());

const mockUseExerciseById = useExerciseById as jest.Mock;

describe('useSessionExercise', () => {
  it('should return null if no exercise exists', () => {
    mockUseExerciseById.mockReturnValueOnce(null);
    useSessionState.setState({
      session: {
        id: 'test',
      } as Session,
      asyncSession: {
        id: 'test',
      } as AsyncSession,
    });

    const {result} = renderHook(() => useSessionExercise());

    expect(result.current).toBe(null);
    expect(mockUseExerciseById).toHaveBeenCalledWith(undefined);
  });

  it('should return null if no session exists', () => {
    mockUseExerciseById.mockReturnValueOnce(null);
    useSessionState.setState({
      session: null,
      asyncSession: null,
    });
    const {result} = renderHook(() => useSessionExercise());

    expect(result.current).toBe(null);
    expect(mockUseExerciseById).toHaveBeenCalledWith(undefined);
  });

  it('should return exercise for live session', () => {
    mockUseExerciseById.mockReturnValueOnce({
      id: 'some-exercise-id',
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    });
    useSessionState.setState({
      session: {
        contentId: 'some-exercise-id',
      } as Session,
      asyncSession: null,
      sessionState: {index: 1} as SessionState,
    });

    const {result} = renderHook(() => useSessionExercise());

    expect(result.current).toEqual({
      id: 'some-exercise-id',
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    });
    expect(mockUseExerciseById).toHaveBeenCalledWith('some-exercise-id');
  });

  it('should return exercise for async session', () => {
    mockUseExerciseById.mockReturnValueOnce({
      id: 'some-exercise-id',
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    });
    useSessionState.setState({
      asyncSession: {
        contentId: 'some-exercise-id',
      } as AsyncSession,
      session: null,
      sessionState: {index: 1} as SessionState,
    });

    const {result} = renderHook(() => useSessionExercise());

    expect(result.current).toEqual({
      id: 'some-exercise-id',
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    });
    expect(mockUseExerciseById).toHaveBeenCalledWith('some-exercise-id');
  });

  it('should memoize return', () => {
    const exercise = {
      id: 'some-exercise-id',
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    };

    mockUseExerciseById.mockReturnValueOnce(exercise);
    useSessionState.setState({
      session: {
        contentId: 'some-exercise-id',
      } as Session,
      sessionState: {index: 1} as SessionState,
    });

    const {result, rerender} = renderHook(() => useSessionExercise());

    mockUseExerciseById.mockReturnValueOnce(exercise);
    rerender();

    expect(result.all.length).toBe(2);
    expect(result.all[0]).toBe(result.all[1]);
  });
});
