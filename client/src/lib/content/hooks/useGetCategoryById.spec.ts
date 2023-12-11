import {renderHook} from '@testing-library/react-hooks';
import {act} from 'react-test-renderer';
import useGetCategoryById from './useGetCategoryById';

const mockT = jest.fn().mockReturnValue({name: 'some-category'});
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useGetCategoryById', () => {
  it('returns a translated category', () => {
    const {result} = renderHook(() => useGetCategoryById());

    act(() => {
      expect(result.current('some-category-id')).toEqual({
        name: 'some-category',
      });
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-category-id', {
      returnObjects: true,
    });
  });

  it('returns null if category is not found', () => {
    mockT.mockReturnValueOnce('some-category-id');
    const {result} = renderHook(() => useGetCategoryById());

    act(() => {
      expect(result.current('some-category-id')).toBe(null);
    });
  });

  it('returns a translated category for a specific language', () => {
    const {result} = renderHook(() => useGetCategoryById());

    act(() => {
      expect(result.current('some-category-id', 'sv')).toEqual({
        name: 'some-category',
      });
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-category-id', {
      returnObjects: true,
      lng: 'sv',
    });
  });
});
