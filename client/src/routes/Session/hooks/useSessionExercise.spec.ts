import {renderHook} from '@testing-library/react-hooks';
import {Session, SessionState} from '../../../../../shared/src/types/Session';
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
    });

    const {result} = renderHook(() => useSessionExercise());

    expect(result.current).toBe(null);
  });

  it('should return null if no session exists', () => {
    mockUseExerciseById.mockReturnValueOnce({});
    useSessionState.setState({
      session: null,
    });
    const {result} = renderHook(() => useSessionExercise());

    expect(result.current).toBe(null);
  });

  it('should return exercise', () => {
    mockUseExerciseById.mockReturnValueOnce({
      id: 'some-exercise-id',
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    });
    useSessionState.setState({
      session: {
        exerciseId: 'some-exercise-id',
      } as Session,
      sessionState: {index: 1} as SessionState,
    });

    const {result} = renderHook(() => useSessionExercise());

    expect(result.current).toEqual({
      id: 'some-exercise-id',
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    });
  });

  it('should memoize return', () => {
    const exercise = {
      id: 'some-exercise-id',
      slides: [{type: 'slide-1'}, {type: 'slide-2'}, {type: 'slide-3'}],
    };

    mockUseExerciseById.mockReturnValueOnce(exercise);
    useSessionState.setState({
      session: {
        exerciseId: 'some-exercise-id',
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
