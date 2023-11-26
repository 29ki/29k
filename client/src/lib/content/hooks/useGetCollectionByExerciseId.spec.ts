import {renderHook} from '@testing-library/react-hooks';
import useGetCollectionById from './useGetCollectionById';
import usePinnedCollections from '../../user/hooks/usePinnedCollections';
import useGetCollectionByExerciseId from './useGetCollectionByExerciseId';

jest.mock('../../user/hooks/usePinnedCollections');
const mockUsePinnedCollections = usePinnedCollections as jest.Mock;
mockUsePinnedCollections.mockReturnValue({
  pinnedCollections: [],
});

const mockGetExercisesByCollectionId = jest.fn();
jest.mock(
  '../../content/hooks/useGetExercisesByCollectionId',
  () => () => mockGetExercisesByCollectionId,
);

const mockUseGetCollectionById = jest.mocked(useGetCollectionById);
const mockGetCollectionById = jest.fn();
mockUseGetCollectionById.mockReturnValue(mockGetCollectionById);
jest.mock('./useGetCollectionById');

afterEach(() => {
  jest.clearAllMocks();
});

describe('useGetCollectionByExerciseId', () => {
  it('returns collection if exercise is in pinned collection', () => {
    mockUsePinnedCollections.mockReturnValueOnce({
      pinnedCollections: [{id: 'some-collection-id'}],
    });
    mockGetExercisesByCollectionId.mockReturnValueOnce([
      {id: 'some-exercise-id'},
    ]);
    mockGetCollectionById.mockReturnValueOnce({
      id: 'some-collection-id',
      name: 'Some Collection',
    });

    const {result} = renderHook(() => useGetCollectionByExerciseId());

    const collection = result.current('some-exercise-id');

    expect(mockGetExercisesByCollectionId).toHaveBeenCalledTimes(1);
    expect(mockGetExercisesByCollectionId).toHaveBeenCalledWith(
      'some-collection-id',
    );
    expect(mockGetCollectionById).toHaveBeenCalledTimes(1);
    expect(mockGetCollectionById).toHaveBeenCalledWith('some-collection-id');
    expect(collection).toEqual({
      id: 'some-collection-id',
      name: 'Some Collection',
    });
  });

  it('returns the first pinned collection', () => {
    mockUsePinnedCollections.mockReturnValueOnce({
      pinnedCollections: [
        {id: 'some-collection-id'},
        {id: 'some-other-collection-id'},
      ],
    });
    mockGetExercisesByCollectionId.mockReturnValueOnce([
      {id: 'some-exercise-id'},
    ]);
    mockGetCollectionById.mockReturnValueOnce({
      id: 'some-collection-id',
      name: 'Some Collection',
    });

    const {result} = renderHook(() => useGetCollectionByExerciseId());

    const collection = result.current('some-exercise-id');

    expect(mockGetExercisesByCollectionId).toHaveBeenCalledTimes(1);
    expect(mockGetExercisesByCollectionId).toHaveBeenCalledWith(
      'some-collection-id',
    );
    expect(mockGetCollectionById).toHaveBeenCalledTimes(1);
    expect(mockGetCollectionById).toHaveBeenCalledWith('some-collection-id');
    expect(collection).toEqual({
      id: 'some-collection-id',
      name: 'Some Collection',
    });
  });

  it('returns undefined if no collections are pinned', () => {
    mockUsePinnedCollections.mockReturnValueOnce({
      pinnedCollections: [],
    });
    const {result} = renderHook(() => useGetCollectionByExerciseId());

    const collection = result.current('some-exercise-id');

    expect(mockGetExercisesByCollectionId).toHaveBeenCalledTimes(0);
    expect(mockGetCollectionById).toHaveBeenCalledTimes(0);
    expect(collection).toBeUndefined();
  });

  it("returns undefined if pinned collections don't include exercise", () => {
    mockUsePinnedCollections.mockReturnValueOnce({
      pinnedCollections: [{id: 'some-collection-id'}],
    });
    mockGetExercisesByCollectionId.mockReturnValueOnce([
      {id: 'some-other-exercise-id'},
    ]);

    const {result} = renderHook(() => useGetCollectionByExerciseId());

    const collection = result.current('some-exercise-id');

    expect(mockGetExercisesByCollectionId).toHaveBeenCalledTimes(1);
    expect(mockGetExercisesByCollectionId).toHaveBeenCalledWith(
      'some-collection-id',
    );
    expect(mockGetCollectionById).toHaveBeenCalledTimes(0);
    expect(collection).toBeUndefined();
  });
});
