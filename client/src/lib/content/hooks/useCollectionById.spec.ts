import {renderHook} from '@testing-library/react-hooks';
import useCollectionById from './useCollectionById';

const mockT = jest.fn().mockReturnValue('some-collection');
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
    const {result} = renderHook(() => useCollectionById('some-collection-id'));

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-collection-id', {
      returnObjects: true,
    });

    expect(result.current).toBe('some-collection');
  });

  it('returns null when no ID is provided', () => {
    const {result} = renderHook(() => useCollectionById(undefined));

    expect(mockT).toHaveBeenCalledTimes(0);

    expect(result.current).toBe(null);
  });

  it('memoizes the result - as i18next.t is not pure', () => {
    const {result, rerender} = renderHook(() =>
      useCollectionById('some-collection-id'),
    );

    rerender();

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(result.all.length).toEqual(2);
  });
});
