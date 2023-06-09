import {renderHook} from '@testing-library/react-hooks';
import useGetCollectionsByExerciseId from './useGetCollectionsByExerciseId';

jest.mock('./useCollections', () => () => [
  {
    id: 'some-collection-id-1',
    exercises: ['exercise-id-1', 'exercise-id-2'],
  },
  {
    id: 'some-collection-id-2',
    exercises: ['exercise-id-1', 'exercise-id-3'],
  },
]);

describe('useGetCollectionsByExerciseId', () => {
  it('should get all collections with exercise 1', () => {
    const {result} = renderHook(() => useGetCollectionsByExerciseId());
    expect(result.current('exercise-id-1')).toEqual([
      {
        id: 'some-collection-id-1',
        exercises: ['exercise-id-1', 'exercise-id-2'],
      },
      {
        id: 'some-collection-id-2',
        exercises: ['exercise-id-1', 'exercise-id-3'],
      },
    ]);
  });

  it('should get collection with exercise 2', () => {
    const {result} = renderHook(() => useGetCollectionsByExerciseId());
    expect(result.current('exercise-id-2')).toEqual([
      {
        id: 'some-collection-id-1',
        exercises: ['exercise-id-1', 'exercise-id-2'],
      },
    ]);
  });
});
