import {renderHook} from '@testing-library/react-hooks';
import {act} from 'react-test-renderer';
import useGetCollectionById from './useGetCollectionById';

const mockT = jest.fn();
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
    mockT.mockReturnValue({});
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id')).toEqual({});
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-collection-id', {
      returnObjects: true,
    });
  });

  it('returns undefined if no collections', () => {
    mockT.mockReturnValue('some-collection-id');
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id')).toBe(null);
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-collection-id', {
      returnObjects: true,
    });
  });
});
