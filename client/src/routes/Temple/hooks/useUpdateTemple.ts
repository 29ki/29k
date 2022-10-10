import {useCallback} from 'react';
import {Temple} from '../../../../../shared/src/types/Temple';
import * as templeApi from '../../Temples/api/temple';

const useUpdateTemple = (templeId: Temple['id']) => {
  const setStarted = useCallback(async () => {
    return templeApi.updateTemple(templeId, {started: true});
  }, [templeId]);

  const setEnded = useCallback(async () => {
    return templeApi.updateTemple(templeId, {ended: true});
  }, [templeId]);

  return {setStarted, setEnded};
};
export default useUpdateTemple;
