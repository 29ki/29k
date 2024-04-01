import {renderHook} from '@testing-library/react-hooks';
import useCollectionById from './useCollectionById';

const mockGetCollectionById = jest
  .fn()
  .mockReturnValue({name: 'some-collection'});
jest.mock('./useGetCollectionById', () => () => mockGetCollectionById);

afterEach(() => {
  jest.clearAllMocks();
});

describe('useCollectionById', () => {
  it('returns a translated collection', () => {
    const {result} = renderHook(() => useCollectionById('some-collection-id'));

    expect(mockGetCollectionById).toHaveBeenCalledTimes(1);
    expect(mockGetCollectionById).toHaveBeenCalledWith(
      'some-collection-id',
      undefined,
      undefined,
    );

    expect(result.current).toEqual({name: 'some-collection'});
  });

  it('returns a translated collection for a specific language', () => {
    const {result} = renderHook(() =>
      useCollectionById('some-collection-id', 'sv'),
    );

    expect(mockGetCollectionById).toHaveBeenCalledTimes(1);
    expect(mockGetCollectionById).toHaveBeenCalledWith(
      'some-collection-id',
      'sv',
      undefined,
    );

    expect(result.current).toEqual({name: 'some-collection'});
  });

  it('returns null when no ID is provided', () => {
    const {result} = renderHook(() => useCollectionById(undefined));

    expect(mockGetCollectionById).toHaveBeenCalledTimes(0);

    expect(result.current).toBe(null);
  });

  it('memoizes the result - as i18next.t is not pure', () => {
    const {result, rerender} = renderHook(() =>
      useCollectionById('some-collection-id'),
    );

    rerender();

    expect(mockGetCollectionById).toHaveBeenCalledTimes(1);
    expect(result.all.length).toEqual(2);
  });
});
