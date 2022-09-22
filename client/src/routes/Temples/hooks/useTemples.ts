import {useCallback} from 'react';
import {useRecoilValue, useSetRecoilState} from 'recoil';
import * as templesApi from '../api/temples';
import * as templeApi from '../api/temple';

import {isLoadingAtom, templesAtom} from '../state/state';
import {userAtom} from '../../../lib/user/state/state';

const useTemples = () => {
  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const setTemples = useSetRecoilState(templesAtom);
  const user = useRecoilValue(userAtom);

  const fetchTemples = useCallback(async () => {
    if (user !== null) {
      setIsLoading(true);
      setTemples(await templesApi.fetchTemples());
      setIsLoading(false);
    }
  }, [setIsLoading, setTemples, user]);

  const addTemple = useCallback(
    async (templeName?: string) => {
      if (!templeName || user === null) {
        return;
      }

      await templeApi.addTemple(templeName);
      fetchTemples();
    },
    [fetchTemples, user],
  );

  const deleteTemple = useCallback(
    async (templeId?: string) => {
      if (!templeId) {
        return;
      }

      await templeApi.deleteTemple(templeId);
      fetchTemples();
    },
    [fetchTemples],
  );

  return {
    fetchTemples,
    addTemple,
    deleteTemple,
  };
};

export default useTemples;
