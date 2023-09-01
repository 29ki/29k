import {renderHook} from '@testing-library/react-hooks';
import {act} from 'react-test-renderer';
import useGetCollectionById from './useGetCollectionById';

const mockT = jest.fn().mockReturnValue({name: 'some-collection'});
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('useGetCollectionById', () => {
  it('returns a translated collection', () => {
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id')).toEqual({
        name: 'some-collection',
      });
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-collection-id', {
      returnObjects: true,
    });
  });

  it('returns null if collection is not found', () => {
    mockT.mockReturnValueOnce('some-collection-id');
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id')).toBe(null);
    });
  });

  it('returns a translated collection for a specific language', () => {
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id', 'sv')).toEqual({
        name: 'some-collection',
      });
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-collection-id', {
      returnObjects: true,
      lng: 'sv',
    });
  });
});
