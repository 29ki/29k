import {renderHook} from '@testing-library/react-hooks';
import useExercisesByCollectionId from './useExercisesByCollectionId';

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
    const {result} = renderHook(() =>
      useExercisesByCollectionId('some-collection-id'),
    );

    expect(result.current).toEqual([
      {id: 'some-exercise-id'},
      {id: 'some-hidden-exercise-id'},
    ]);
  });

  it('return empty array if no collectionId is provided', () => {
    const {result} = renderHook(() => useExercisesByCollectionId());

    expect(result.current).toEqual([]);
  });
});
