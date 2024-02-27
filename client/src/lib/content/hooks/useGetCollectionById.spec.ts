import {renderHook} from '@testing-library/react-hooks';
import {act} from 'react-test-renderer';
import useGetCollectionById from './useGetCollectionById';
import useAppState from '../../appState/state/state';

const mockT = jest.fn().mockReturnValue({name: 'some-collection'});
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({
    t: mockT,
  })),
}));

const mockUseUnlockedCollectionIds = jest.fn();
jest.mock(
  '../../user/hooks/useUnlockedCollectionIds',
  () => () => mockUseUnlockedCollectionIds(),
);

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

  it('returns null if collection is locked', () => {
    mockT.mockReturnValueOnce({name: 'some-collection-id', locked: true});
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

  it('returns locked exercise if appState.showLockedContent == true', () => {
    useAppState.setState({
      settings: {
        showLockedContent: true,
        showHiddenContent: false,
        showOnboarding: false,
      },
    });
    mockT.mockReturnValueOnce({name: 'some-collection', locked: true});
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id')).toEqual({
        name: 'some-collection',
        locked: true,
      });
    });
  });

  it('returns locked collection if id is in useUnlockedCollectionIds', () => {
    mockUseUnlockedCollectionIds.mockReturnValueOnce(['some-collection-id']);
    mockT.mockReturnValueOnce({
      id: 'some-collection-id',
      name: 'some-collection',
      locked: true,
    });
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id')).toEqual({
        id: 'some-collection-id',
        name: 'some-collection',
        locked: true,
      });
    });
  });
});
