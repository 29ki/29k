import {useCallback} from 'react';
import {useSetRecoilState} from 'recoil';
import * as templesApi from '../api/temples';
import * as templeApi from '../api/temple';

import {isLoadingAtom, templesAtom} from '../state/state';
import dayjs from 'dayjs';

const useTemples = () => {
  const setIsLoading = useSetRecoilState(isLoadingAtom);
  const setTemples = useSetRecoilState(templesAtom);

  const fetchTemples = useCallback(async () => {
    setIsLoading(true);
    setTemples(await templesApi.fetchTemples());
    setIsLoading(false);
  }, [setIsLoading, setTemples]);

  const addTemple = useCallback(
    async (templeName: string, contentId: string, startTime: dayjs.Dayjs) => {
      if (!templeName) {
        return;
      }

      await templeApi.addTemple(templeName, contentId, startTime.toJSON());
      fetchTemples();
    },
    [fetchTemples],
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
