import {renderHook} from '@testing-library/react-hooks';
import {act} from 'react-test-renderer';
import useGetCollectionById from './useGetCollectionById';

const mockT = jest.fn().mockReturnValue('some-collection');
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
      expect(result.current('some-collection-id')).toBe('some-collection');
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-collection-id', {
      returnObjects: true,
    });
  });
});
