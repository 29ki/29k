import {renderHook} from '@testing-library/react-hooks';
import useCategoryById from './useCategoryById';

const mockT = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useCategoryById', () => {
  it('returns a translated category', () => {
    mockT.mockReturnValue({});
    const {result} = renderHook(() => useCategoryById('some-category-id'));

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-category-id', {
      returnObjects: true,
    });

    expect(result.current).toEqual({});
  });

  it('returns null when no ID is provided', () => {
    mockT.mockReturnValue({});
    const {result} = renderHook(() => useCategoryById(undefined));

    expect(mockT).toHaveBeenCalledTimes(0);

    expect(result.current).toBe(null);
  });

  it('memoizes the result - as i18next.t is not pure', () => {
    mockT.mockReturnValue({});
    const {result, rerender} = renderHook(() =>
      useCategoryById('some-category-id'),
    );

    rerender();

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(result.all.length).toEqual(2);
  });
});
