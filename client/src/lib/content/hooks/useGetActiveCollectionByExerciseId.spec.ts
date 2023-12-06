import {renderHook} from '@testing-library/react-hooks';
import useGetCollectionById from './useGetCollectionById';
import usePinnedCollections from '../../user/hooks/usePinnedCollections';
import useGetActiveCollectionByExerciseId from './useGetActiveCollectionByExerciseId';

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

const mockGetCompletedSessionByExerciseId = jest.fn();
jest.mock('../../user/hooks/useCompletedSessionByTime', () => () => ({
  getCompletedSessionByExerciseId: mockGetCompletedSessionByExerciseId,
}));

const mockUseGetCollectionById = jest.mocked(useGetCollectionById);
const mockGetCollectionById = jest.fn();
mockUseGetCollectionById.mockReturnValue(mockGetCollectionById);
jest.mock('./useGetCollectionById');

afterEach(() => {
  jest.clearAllMocks();
});

describe('useGetActiveCollectionByExerciseId', () => {
  it('returns collection if exercise is in pinned collection and not yet completed', () => {
    mockUsePinnedCollections.mockReturnValueOnce({
      pinnedCollections: [
        {id: 'some-collection-id', startedAt: 'some-timestamp'},
      ],
    });
    mockGetExercisesByCollectionId.mockReturnValueOnce([
      {id: 'some-exercise-id'},
    ]);
    mockGetCollectionById.mockReturnValueOnce({
      id: 'some-collection-id',
      name: 'Some Collection',
    });

    const {result} = renderHook(() => useGetActiveCollectionByExerciseId());

    const collection = result.current('some-exercise-id');

    expect(mockGetExercisesByCollectionId).toHaveBeenCalledTimes(1);
    expect(mockGetExercisesByCollectionId).toHaveBeenCalledWith(
      'some-collection-id',
    );
    expect(mockGetCompletedSessionByExerciseId).toHaveBeenCalledTimes(1);
    expect(mockGetCompletedSessionByExerciseId).toHaveBeenCalledWith(
      'some-exercise-id',
      'some-timestamp',
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
        {id: 'some-collection-id', startedAt: 'some-timestamp'},
        {id: 'some-other-collection-id', startedAt: 'some-other-timestamp'},
      ],
    });
    mockGetExercisesByCollectionId.mockReturnValueOnce([
      {id: 'some-exercise-id'},
    ]);
    mockGetCollectionById.mockReturnValueOnce({
      id: 'some-collection-id',
      name: 'Some Collection',
    });

    const {result} = renderHook(() => useGetActiveCollectionByExerciseId());

    const collection = result.current('some-exercise-id');

    expect(mockGetExercisesByCollectionId).toHaveBeenCalledTimes(1);
    expect(mockGetExercisesByCollectionId).toHaveBeenCalledWith(
      'some-collection-id',
    );
    expect(mockGetCompletedSessionByExerciseId).toHaveBeenCalledTimes(1);
    expect(mockGetCompletedSessionByExerciseId).toHaveBeenCalledWith(
      'some-exercise-id',
      'some-timestamp',
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
    const {result} = renderHook(() => useGetActiveCollectionByExerciseId());

    const collection = result.current('some-exercise-id');

    expect(collection).toBeUndefined();
  });

  it("returns undefined if pinned collections don't include exercise", () => {
    mockUsePinnedCollections.mockReturnValueOnce({
      pinnedCollections: [{id: 'some-collection-id'}],
    });
    mockGetExercisesByCollectionId.mockReturnValueOnce([
      {id: 'some-other-exercise-id'},
    ]);

    const {result} = renderHook(() => useGetActiveCollectionByExerciseId());

    const collection = result.current('some-exercise-id');

    expect(collection).toBeUndefined();
  });

  it('returns undefined if exercise is already completed', () => {
    mockUsePinnedCollections.mockReturnValueOnce({
      pinnedCollections: [
        {id: 'some-collection-id', startedAt: 'some-timestamp'},
      ],
    });
    mockGetExercisesByCollectionId.mockReturnValueOnce([
      {id: 'some-other-exercise-id'},
    ]);
    mockGetCompletedSessionByExerciseId.mockReturnValueOnce({
      id: 'some-exercise-id',
      timestamp: 'some-timestamp',
    });

    const {result} = renderHook(() => useGetActiveCollectionByExerciseId());

    const collection = result.current('some-exercise-id');

    expect(collection).toBeUndefined();
  });
});
