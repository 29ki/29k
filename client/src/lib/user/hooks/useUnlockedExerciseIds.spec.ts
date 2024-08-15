import {renderHook} from '@testing-library/react-hooks';
import useUnlockedExerciseIds from './useUnlockedExerciseIds';

const mockUseUnlockedCollectionIds = jest
  .fn()
  .mockReturnValue(['some-collection-id', 'some-other-collection-id']);
jest.mock(
  './useUnlockedCollectionIds',
  () => () => mockUseUnlockedCollectionIds(),
);

const mockUseCollections = jest.fn().mockReturnValue([
  {
    id: 'some-collection-id',
    exercises: ['some-exercise-id', 'some-other-exercise-id'],
  },
  {
    id: 'some-other-collection-id',
    exercises: ['some-third-exercise-id'],
  },
]);
jest.mock(
  '../../content/hooks/useCollections',
  () => (collectionsIds?: string[]) => mockUseCollections(collectionsIds),
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useUnlockedExerciseIds', () => {
  it('returns exercise ids of unlocked collections', () => {
    const {result} = renderHook(() => useUnlockedExerciseIds());

    expect(mockUseUnlockedCollectionIds).toHaveBeenCalledTimes(1);
    expect(mockUseCollections).toHaveBeenCalledTimes(1);
    expect(mockUseCollections).toHaveBeenCalledWith([
      'some-collection-id',
      'some-other-collection-id',
    ]);

    expect(result.current).toEqual([
      'some-exercise-id',
      'some-other-exercise-id',
      'some-third-exercise-id',
    ]);
  });
});
