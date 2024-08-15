import {renderHook} from '@testing-library/react-hooks';
import {act} from 'react-test-renderer';
import useGetCollectionById from './useGetCollectionById';
import useAppState from '../../appState/state/state';

const mockT = jest.fn().mockReturnValue({
  res: {name: 'some-collection'},
  usedLng: 'en',
});
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
        language: 'en',
        name: 'some-collection',
      });
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-collection-id', {
      returnObjects: true,
      returnDetails: true,
      keySeparator: false,
    });
  });

  it('returns null if collection is not found', () => {
    mockT.mockReturnValueOnce({res: 'some-collection-id'});
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id')).toBe(null);
    });
  });

  it('returns null if collection is locked', () => {
    mockT.mockReturnValueOnce({
      res: {name: 'some-collection-id', locked: true},
      usedLng: 'en',
    });
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id')).toBe(null);
    });
  });

  it('returns a translated collection for a specific language', () => {
    mockT.mockReturnValueOnce({
      res: {name: 'some-collection'},
      usedLng: 'sv',
    });
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id', 'sv')).toEqual({
        name: 'some-collection',
        language: 'sv',
      });
    });

    expect(mockT).toHaveBeenCalledTimes(1);
    expect(mockT).toHaveBeenCalledWith('some-collection-id', {
      returnObjects: true,
      returnDetails: true,
      keySeparator: false,
      lng: 'sv',
    });
  });

  it('returns locked collection if appState.showLockedContent == true', () => {
    useAppState.setState({
      settings: {
        showLockedContent: true,
        showHiddenContent: false,
        showOnboarding: false,
      },
    });
    mockT.mockReturnValueOnce({
      res: {name: 'some-collection', locked: true},
      usedLng: 'en',
    });
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id')).toEqual({
        language: 'en',
        name: 'some-collection',
        locked: true,
      });
    });
  });

  it('returns locked collection if id is in useUnlockedCollectionIds', () => {
    mockUseUnlockedCollectionIds.mockReturnValueOnce(['some-collection-id']);
    mockT.mockReturnValueOnce({
      res: {
        id: 'some-collection-id',
        name: 'some-collection',
        locked: true,
      },
      usedLng: 'en',
    });
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id')).toEqual({
        language: 'en',
        id: 'some-collection-id',
        name: 'some-collection',
        locked: true,
      });
    });
  });

  it('returns locked collection if ignoreLocked = true', () => {
    mockT.mockReturnValueOnce({
      res: {
        id: 'some-collection-id',
        name: 'some-collection',
        locked: true,
      },
      usedLng: 'en',
    });
    const {result} = renderHook(() => useGetCollectionById());

    act(() => {
      expect(result.current('some-collection-id', undefined, true)).toEqual({
        language: 'en',
        id: 'some-collection-id',
        name: 'some-collection',
        locked: true,
      });
    });
  });
});
