import {renderHook} from '@testing-library/react-hooks';
import useGetExercisesByCollectionId from './useGetExercisesByCollectionId';
import useAppState from '../../appState/state/state';

jest.mock('./useGetCollectionById', () => () => () => ({
  exercises: ['some-exercise-id', 'some-hidden-exercise-id'],
}));
jest.mock(
  './useGetExerciseById',
  () => () =>
    jest
      .fn()
      .mockReturnValueOnce({id: 'some-exercise-id'})
      .mockReturnValueOnce({id: 'some-hidden-exercise-id', hidden: true}),
);

describe('useExercisesByCollectionId', () => {
  it('should return non hidden exercises if shodHiddenContent is on', () => {
    useAppState.setState({
      settings: {
        showHiddenContent: true,
        showOnboarding: false,
      },
    });
    const {result} = renderHook(() => useGetExercisesByCollectionId());

    expect(result.current('some-collection-id')).toEqual([
      {id: 'some-exercise-id'},
      {id: 'some-hidden-exercise-id', hidden: true},
    ]);
  });
});
