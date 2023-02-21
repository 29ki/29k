import {useMemo} from 'react';
import useDailyState from '../../daily/state/state';

const useIsSessionHost = () => {
  const participants = useDailyState(state => state.participants);

  return useMemo(() => {
    return Boolean(Object.values(participants).find(p => p.owner && p.local));
  }, [participants]);
};

export default useIsSessionHost;
