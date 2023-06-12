import {renderHook} from '@testing-library/react-hooks';
import useExercisesByCollectionId from './useExercisesByCollectionId';
import useAppState from '../../appState/state/state';

jest.mock('./useCollectionById', () => () => ({
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
  it('should only return non hidden exercises', () => {
    const {result} = renderHook(() =>
      useExercisesByCollectionId('some-collection-id'),
    );

    expect(result.current).toEqual([{id: 'some-exercise-id'}]);
  });

  it('should return non hidden exercises if shodHiddenContent is on', () => {
    useAppState.setState({
      settings: {
        showHiddenContent: true,
        showOnboarding: false,
      },
    });
    const {result} = renderHook(() =>
      useExercisesByCollectionId('some-collection-id'),
    );

    expect(result.current).toEqual([
      {id: 'some-exercise-id'},
      {id: 'some-hidden-exercise-id', hidden: true},
    ]);
  });
});
