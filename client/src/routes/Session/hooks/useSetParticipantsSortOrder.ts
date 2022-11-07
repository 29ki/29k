import {without} from 'ramda';
import {useCallback} from 'react';
import useDailyState from '../../../lib/daily/state/state';

const useSetParticipantsSortOrder = () => {
  const participantsSortOrder = useDailyState(
    state => state.participantsSortOrder,
  );
  const setParticipantsSortOrder = useDailyState(
    state => state.setParticipantsSortOrder,
  );

  return useCallback(
    (userId: string) => {
      if (
        userId === participantsSortOrder[0] ||
        userId === participantsSortOrder[1]
      ) {
        return;
      }

      setParticipantsSortOrder([
        userId,
        ...without([userId], participantsSortOrder),
      ]);
    },
    [setParticipantsSortOrder, participantsSortOrder],
  );
};

export default useSetParticipantsSortOrder;
