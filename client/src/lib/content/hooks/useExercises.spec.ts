import {renderHook} from '@testing-library/react-hooks';
import useExercises from './useExercises';
import useGetExerciseById from './useGetExerciseById';
import useExerciseIds from './useExerciseIds';

const mockUseExerciseIds = jest.mocked(useExerciseIds);
jest.mock('./useExerciseIds');

const mockUseGetExerciseById = jest.mocked(useGetExerciseById);
const mockGetExerciseById = jest.fn();
mockUseGetExerciseById.mockReturnValue(mockGetExerciseById);
jest.mock('./useGetExerciseById');

afterEach(() => {
  jest.clearAllMocks();
});

describe('useExercises', () => {
  it('should return exercises sorted by name', () => {
    mockUseExerciseIds.mockReturnValueOnce([
      'some-exercise-id',
      'some-other-exercise-id',
    ]);
    mockGetExerciseById
      .mockReturnValueOnce({name: 'bbb'})
      .mockReturnValueOnce({name: 'aaa'});

    const {result} = renderHook(() => useExercises());

    expect(mockGetExerciseById).toHaveBeenCalledTimes(2);
    expect(mockGetExerciseById).toHaveBeenCalledWith('some-exercise-id');
    expect(mockGetExerciseById).toHaveBeenCalledWith('some-other-exercise-id');
    expect(result.current).toEqual([{name: 'aaa'}, {name: 'bbb'}]);
  });

  it('should not sort when sort = false', () => {
    mockUseExerciseIds.mockReturnValueOnce([
      'some-exercise-id',
      'some-other-exercise-id',
    ]);
    mockGetExerciseById
      .mockReturnValueOnce({name: 'bbb'})
      .mockReturnValueOnce({name: 'aaa'});

    const {result} = renderHook(() => useExercises(undefined, false));

    expect(result.current).toEqual([{name: 'bbb'}, {name: 'aaa'}]);
  });

  it('filters out nil exercises', () => {
    mockUseExerciseIds.mockReturnValueOnce([
      'some-exercise-id',
      'some-other-exercise-id',
    ]);
    mockGetExerciseById
      .mockReturnValueOnce(null)
      .mockReturnValueOnce({name: 'bbb'});

    const {result} = renderHook(() => useExercises());

    expect(mockGetExerciseById).toHaveBeenCalledTimes(2);
    expect(mockGetExerciseById).toHaveBeenCalledWith('some-exercise-id');
    expect(mockGetExerciseById).toHaveBeenCalledWith('some-other-exercise-id');
    expect(result.current).toEqual([{name: 'bbb'}]);
  });

  it('should return empty list if no exercises', () => {
    mockUseExerciseIds.mockReturnValueOnce([]);

    const {result} = renderHook(() => useExercises());

    expect(mockGetExerciseById).toHaveBeenCalledTimes(0);

    expect(result.current).toEqual([]);
  });

  it('allows for specififying specific exercise ids', () => {
    mockUseExerciseIds.mockReturnValueOnce([
      'some-exercise-id',
      'some-other-exercise-id',
      'some-third-exercise-id',
    ]);
    renderHook(() =>
      useExercises(['some-other-exercise-id', 'some-third-exercise-id']),
    );

    expect(mockGetExerciseById).toHaveBeenCalledTimes(2);
    expect(mockGetExerciseById).not.toHaveBeenCalledWith('some-exercise-id');
    expect(mockGetExerciseById).toHaveBeenCalledWith('some-other-exercise-id');
    expect(mockGetExerciseById).toHaveBeenCalledWith('some-third-exercise-id');
  });
});
