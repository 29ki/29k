import {act, renderHook} from '@testing-library/react-hooks';
import useUserState from '../state/state';
import useUnlockCollectionById from './useUnlockCollectionById';
import {LANGUAGE_TAG} from '../../i18n';

const mockUseCollectionById = jest
  .fn()
  .mockReturnValue({id: 'some-collection-id'});
jest.mock(
  '../../content/hooks/useCollectionById',
  () =>
    (id: string | undefined, language?: LANGUAGE_TAG, ignoreLocked?: boolean) =>
      mockUseCollectionById(id, language, ignoreLocked),
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useUnlockCollectionById', () => {
  describe('isUnlocked', () => {
    it('is false if collection is not unlocked', () => {
      const {result} = renderHook(() =>
        useUnlockCollectionById('some-collection-id'),
      );

      expect(result.current.isUnlocked).toBe(false);
    });

    it('is true if collection is unlocked', () => {
      useUserState.setState({
        userState: {
          ephemeral: {
            unlockedCollectionIds: ['some-collection-id'],
          },
        },
      });

      const {result} = renderHook(() =>
        useUnlockCollectionById('some-collection-id'),
      );

      expect(result.current.isUnlocked).toBe(true);
    });

    it('is false for non-existing collections', () => {
      mockUseCollectionById.mockReturnValueOnce(null);
      const {result} = renderHook(() =>
        useUnlockCollectionById('some-collection-id'),
      );

      expect(result.current.isUnlocked).toBe(false);
    });
  });

  describe('collection', () => {
    it('is set for existing collections', () => {
      const {result} = renderHook(() =>
        useUnlockCollectionById('some-collection-id'),
      );

      expect(mockUseCollectionById).toHaveBeenCalledTimes(1);
      expect(mockUseCollectionById).toHaveBeenCalledWith(
        'some-collection-id',
        undefined,
        true,
      );
      expect(result.current.collection).toEqual({id: 'some-collection-id'});
    });

    it('is null for non-existing collections', () => {
      mockUseCollectionById.mockReturnValueOnce(null);
      const {result} = renderHook(() =>
        useUnlockCollectionById('some-none-existing-id'),
      );

      expect(mockUseCollectionById).toHaveBeenCalledTimes(1);
      expect(mockUseCollectionById).toHaveBeenCalledWith(
        'some-none-existing-id',
        undefined,
        true,
      );
      expect(result.current.collection).toEqual(null);
    });
  });

  describe('unlockCollection', () => {
    it('adds the collection id to unlockedCollectionIds userState', () => {
      const {result} = renderHook(() =>
        useUnlockCollectionById('some-collection-id'),
      );

      act(() => {
        result.current.unlockCollection();
      });

      expect(useUserState.getState().userState).toEqual({
        ephemeral: {
          unlockedCollectionIds: ['some-collection-id'],
        },
      });
    });

    it('does not add duplicates', () => {
      useUserState.setState({
        userState: {
          ephemeral: {
            unlockedCollectionIds: ['some-collection-id'],
          },
        },
      });
      const {result} = renderHook(() =>
        useUnlockCollectionById('some-collection-id'),
      );

      act(() => {
        result.current.unlockCollection();
      });

      expect(useUserState.getState().userState).toEqual({
        ephemeral: {
          unlockedCollectionIds: ['some-collection-id'],
        },
      });
    });

    it('does not add non-existing collections', () => {
      mockUseCollectionById.mockReturnValueOnce(null);

      const {result} = renderHook(() =>
        useUnlockCollectionById('some-non-existing-collection-id'),
      );

      act(() => {
        result.current.unlockCollection();
      });

      expect(useUserState.getState().userState).toEqual({});
    });

    it('preserves current unlockedCollectionIds for non-existing collections', () => {
      useUserState.setState({
        userState: {
          ephemeral: {
            unlockedCollectionIds: ['some-collection-id'],
          },
        },
      });
      mockUseCollectionById.mockReturnValueOnce(null);

      const {result} = renderHook(() =>
        useUnlockCollectionById('some-non-existing-collection-id'),
      );

      act(() => {
        result.current.unlockCollection();
      });

      expect(useUserState.getState().userState).toEqual({
        ephemeral: {
          unlockedCollectionIds: ['some-collection-id'],
        },
      });
    });
  });
});
