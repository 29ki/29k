import {renderHook} from '@testing-library/react-hooks';
import useExerciseById from './useExerciseById';

const mockGetExerciseById = jest.fn().mockReturnValue({name: 'some-exercise'});
jest.mock('./useGetExerciseById', () => () => mockGetExerciseById);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useExerciseById', () => {
  it('returns a translated exercise', () => {
    const {result} = renderHook(() => useExerciseById('some-exercise-id'));

    expect(mockGetExerciseById).toHaveBeenCalledTimes(1);
    expect(mockGetExerciseById).toHaveBeenCalledWith(
      'some-exercise-id',
      undefined,
    );

    expect(result.current).toEqual({name: 'some-exercise'});
  });

  it('returns a translated exercise for a specific language', () => {
    const {result} = renderHook(() =>
      useExerciseById('some-exercise-id', 'sv'),
    );

    expect(mockGetExerciseById).toHaveBeenCalledTimes(1);
    expect(mockGetExerciseById).toHaveBeenCalledWith('some-exercise-id', 'sv');

    expect(result.current).toEqual({name: 'some-exercise'});
  });

  it('returns null when no ID is provided', () => {
    const {result} = renderHook(() => useExerciseById(undefined));

    expect(mockGetExerciseById).toHaveBeenCalledTimes(0);

    expect(result.current).toBe(null);
  });

  it('memoizes the result - as i18next.t is not pure', () => {
    const {result, rerender} = renderHook(() =>
      useExerciseById('some-exercise-id'),
    );

    rerender();

    expect(mockGetExerciseById).toHaveBeenCalledTimes(1);
    expect(result.all.length).toEqual(2);
  });
});
