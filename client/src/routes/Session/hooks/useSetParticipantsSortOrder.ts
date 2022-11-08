import {without} from 'ramda';
import {useCallback} from 'react';
import useDailyState from '../../../lib/daily/state/state';

const useSetParticipantsSortOrder = () => {
  const setParticipantsSortOrder = useDailyState(
    state => state.setParticipantsSortOrder,
  );

  return useCallback(
    (userId: string) => {
      setParticipantsSortOrder(participantsSortOrder => {
        if (
          userId === participantsSortOrder[0] ||
          userId === participantsSortOrder[1]
        ) {
          return participantsSortOrder;
        }

        return [userId, ...without([userId], participantsSortOrder)];
      });
    },
    [setParticipantsSortOrder],
  );
};

export default useSetParticipantsSortOrder;
