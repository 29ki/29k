import {renderHook} from '@testing-library/react-hooks';
import useTags from './useTags';
import useTagIds from './useTagIds';
import useGetTagById from './useGetTagById';

const mockUseTagIds = jest.mocked(useTagIds);
jest.mock('./useTagIds');

const mockUseGetTagById = jest.mocked(useGetTagById);
const mockGetTagById = jest.fn();
mockUseGetTagById.mockReturnValue(mockGetTagById);
jest.mock('./useGetTagById');

afterEach(() => {
  jest.clearAllMocks();
});

describe('useTags', () => {
  it('should return tags', () => {
    mockUseTagIds.mockReturnValueOnce(['some-tag-id', 'some-other-tag-id']);
    mockGetTagById
      .mockReturnValueOnce({name: 'aaa'})
      .mockReturnValueOnce({name: 'bbb'});

    const {result} = renderHook(() => useTags());

    expect(mockGetTagById).toHaveBeenCalledTimes(2);
    expect(mockGetTagById).toHaveBeenCalledWith('some-tag-id');
    expect(mockGetTagById).toHaveBeenCalledWith('some-other-tag-id');
    expect(result.current).toEqual([{name: 'aaa'}, {name: 'bbb'}]);
  });

  it('filters out nil tags', () => {
    mockUseTagIds.mockReturnValueOnce(['some-tag-id', 'some-other-tag-id']);
    mockGetTagById.mockReturnValueOnce(null).mockReturnValueOnce({name: 'bbb'});

    const {result} = renderHook(() => useTags());

    expect(mockGetTagById).toHaveBeenCalledTimes(2);
    expect(mockGetTagById).toHaveBeenCalledWith('some-tag-id');
    expect(mockGetTagById).toHaveBeenCalledWith('some-other-tag-id');
    expect(result.current).toEqual([{name: 'bbb'}]);
  });

  it('should return empty list if no tags', () => {
    mockUseTagIds.mockReturnValueOnce([]);

    const {result} = renderHook(() => useTags());

    expect(mockGetTagById).toHaveBeenCalledTimes(0);

    expect(result.current).toEqual([]);
  });

  it('allows for specififying specific tag ids', () => {
    mockUseTagIds.mockReturnValueOnce([
      'some-tag-id',
      'some-other-tag-id',
      'some-third-tag-id',
    ]);
    renderHook(() => useTags(['some-other-tag-id', 'some-third-tag-id']));

    expect(mockGetTagById).toHaveBeenCalledTimes(2);
    expect(mockGetTagById).not.toHaveBeenCalledWith('some-tag-id');
    expect(mockGetTagById).toHaveBeenCalledWith('some-other-tag-id');
    expect(mockGetTagById).toHaveBeenCalledWith('some-third-tag-id');
  });
});
