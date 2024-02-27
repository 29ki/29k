import useCurrentUserState from './useCurrentUserState';

const useUnlockedCollectionIds = () =>
  useCurrentUserState()?.unlockedCollectionIds;

export default useUnlockedCollectionIds;
