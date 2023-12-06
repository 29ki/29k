import {renderHook} from '@testing-library/react-hooks';
import useTagById from './useTagById';

const mockT = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useTagById', () => {
  it('returns a translated tag', () => {
    mockT.mockReturnValue({});
    const {result} = renderHook(() => useTagById('some-tag-id'));

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-tag-id', {
      returnObjects: true,
    });

    expect(result.current).toEqual({});
  });

  it('returns null when no ID is provided', () => {
    mockT.mockReturnValue({});
    const {result} = renderHook(() => useTagById(undefined));

    expect(mockT).toHaveBeenCalledTimes(0);

    expect(result.current).toBe(null);
  });

  it('memoizes the result - as i18next.t is not pure', () => {
    mockT.mockReturnValue({});
    const {result, rerender} = renderHook(() => useTagById('some-tag-id'));

    rerender();

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(result.all.length).toEqual(2);
  });
});
