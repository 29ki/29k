import {renderHook} from '@testing-library/react-hooks';
import useCollectionById from './useCollectionById';

const mockT = jest.fn();
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useCollectionById', () => {
  it('returns a translated collection', () => {
    mockT.mockReturnValue({});
    const {result} = renderHook(() => useCollectionById('some-collection-id'));

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-collection-id', {
      returnObjects: true,
    });

    expect(result.current).toEqual({});
  });

  it('returns null when no ID is provided', () => {
    mockT.mockReturnValue({});
    const {result} = renderHook(() => useCollectionById(undefined));

    expect(mockT).toHaveBeenCalledTimes(0);

    expect(result.current).toBe(null);
  });

  it('returns null when no no collections', () => {
    mockT.mockReturnValue('some-collection-id');
    const {result} = renderHook(() => useCollectionById('some-collection-id'));

    expect(mockT).toHaveBeenCalledTimes(1);

    expect(result.current).toBe(null);
  });

  it('memoizes the result - as i18next.t is not pure', () => {
    mockT.mockReturnValue({});
    const {result, rerender} = renderHook(() =>
      useCollectionById('some-collection-id'),
    );

    rerender();

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(result.all.length).toEqual(2);
  });
});
