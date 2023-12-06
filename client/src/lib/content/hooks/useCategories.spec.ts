import {renderHook} from '@testing-library/react-hooks';
import useCategories from './useCategories';
import useCategoryIds from './useCategoryIds';
import useGetCategoryById from './useGetCategoryById';

const mockUseCategoryIds = jest.mocked(useCategoryIds);
jest.mock('./useCategoryIds');

const mockUseGetCategoryById = jest.mocked(useGetCategoryById);
const mockGetCategoryById = jest.fn();
mockUseGetCategoryById.mockReturnValue(mockGetCategoryById);
jest.mock('./useGetCategoryById');

afterEach(() => {
  jest.clearAllMocks();
});

describe('useCategories', () => {
  it('should return categories', () => {
    mockUseCategoryIds.mockReturnValueOnce([
      'some-category-id',
      'some-other-category-id',
    ]);
    mockGetCategoryById
      .mockReturnValueOnce({name: 'aaa'})
      .mockReturnValueOnce({name: 'bbb'});

    const {result} = renderHook(() => useCategories());

    expect(mockGetCategoryById).toHaveBeenCalledTimes(2);
    expect(mockGetCategoryById).toHaveBeenCalledWith('some-category-id');
    expect(mockGetCategoryById).toHaveBeenCalledWith('some-other-category-id');
    expect(result.current).toEqual([{name: 'aaa'}, {name: 'bbb'}]);
  });

  it('filters out nil categories', () => {
    mockUseCategoryIds.mockReturnValueOnce([
      'some-category-id',
      'some-other-category-id',
    ]);
    mockGetCategoryById
      .mockReturnValueOnce(null)
      .mockReturnValueOnce({name: 'bbb'});

    const {result} = renderHook(() => useCategories());

    expect(mockGetCategoryById).toHaveBeenCalledTimes(2);
    expect(mockGetCategoryById).toHaveBeenCalledWith('some-category-id');
    expect(mockGetCategoryById).toHaveBeenCalledWith('some-other-category-id');
    expect(result.current).toEqual([{name: 'bbb'}]);
  });

  it('should return empty list if no categories', () => {
    mockUseCategoryIds.mockReturnValueOnce([]);

    const {result} = renderHook(() => useCategories());

    expect(mockGetCategoryById).toHaveBeenCalledTimes(0);

    expect(result.current).toEqual([]);
  });
});
