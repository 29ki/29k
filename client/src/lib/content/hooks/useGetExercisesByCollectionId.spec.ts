import {renderHook} from '@testing-library/react-hooks';
import useGetExercisesByCollectionId from './useGetExercisesByCollectionId';

jest.mock('./useGetCollectionById', () => () => () => ({
  exercises: ['some-exercise-id', 'some-hidden-exercise-id'],
}));
jest.mock(
  './useGetExerciseById',
  () => () =>
    jest
      .fn()
      .mockReturnValueOnce({id: 'some-exercise-id'})
      .mockReturnValueOnce({id: 'some-hidden-exercise-id'}),
);

describe('useExercisesByCollectionId', () => {
  it('should return exercises', () => {
    const {result} = renderHook(() => useGetExercisesByCollectionId());

    expect(result.current('some-collection-id')).toEqual([
      {id: 'some-exercise-id'},
      {id: 'some-hidden-exercise-id'},
    ]);
  });
});
