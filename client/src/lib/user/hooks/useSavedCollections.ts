import {useMemo} from 'react';

import useCurrentUserState from './useCurrentUserState';

const useSavedCollections = () => {
  const userState = useCurrentUserState();

  const savedCollections = useMemo(
    () => userState?.savedCollections ?? [],
    [userState?.savedCollections],
  );

  return {savedCollections};
};

export default useSavedCollections;
