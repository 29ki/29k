import {renderHook} from '@testing-library/react-hooks';
import useCollections from './useCollections';
import useCollectionIds from './useCollectionIds';
import useGetCollectionById from './useGetCollectionById';

const mockUseCollectionIds = jest.mocked(useCollectionIds);
jest.mock('./useCollectionIds');

const mockUseGetCollectionById = jest.mocked(useGetCollectionById);
const mockGetCollectionById = jest.fn();
mockUseGetCollectionById.mockReturnValue(mockGetCollectionById);
jest.mock('./useGetCollectionById');

afterEach(() => {
  jest.clearAllMocks();
});

describe('useCollections', () => {
  it('should return collections', () => {
    mockUseCollectionIds.mockReturnValueOnce([
      'some-collection-id',
      'some-other-collection-id',
    ]);
    mockGetCollectionById
      .mockReturnValueOnce({name: 'aaa'})
      .mockReturnValueOnce({name: 'bbb'});

    const {result} = renderHook(() => useCollections());

    expect(mockGetCollectionById).toHaveBeenCalledTimes(2);
    expect(mockGetCollectionById).toHaveBeenCalledWith('some-collection-id');
    expect(mockGetCollectionById).toHaveBeenCalledWith(
      'some-other-collection-id',
    );
    expect(result.current).toEqual([{name: 'aaa'}, {name: 'bbb'}]);
  });

  it('filters out nil collections', () => {
    mockUseCollectionIds.mockReturnValueOnce([
      'some-collection-id',
      'some-other-collection-id',
    ]);
    mockGetCollectionById
      .mockReturnValueOnce(null)
      .mockReturnValueOnce({name: 'bbb'});

    const {result} = renderHook(() => useCollections());

    expect(mockGetCollectionById).toHaveBeenCalledTimes(2);
    expect(mockGetCollectionById).toHaveBeenCalledWith('some-collection-id');
    expect(mockGetCollectionById).toHaveBeenCalledWith(
      'some-other-collection-id',
    );
    expect(result.current).toEqual([{name: 'bbb'}]);
  });

  it('should return empty list if no collections', () => {
    mockUseCollectionIds.mockReturnValueOnce([]);

    const {result} = renderHook(() => useCollections());

    expect(mockGetCollectionById).toHaveBeenCalledTimes(0);

    expect(result.current).toEqual([]);
  });
});
