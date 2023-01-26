import {useMemo} from 'react';
import useDailyState from '../../../lib/daily/state/state';

const useSessionHost = () => {
  const participants = useDailyState(state => state.participants);

  return useMemo(() => {
    return Object.values(participants).find(p => p.owner);
  }, [participants]);
};

export default useSessionHost;
