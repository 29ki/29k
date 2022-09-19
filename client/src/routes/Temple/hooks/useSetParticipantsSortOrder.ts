import {reject, whereEq} from 'ramda';
import {useCallback} from 'react';
import {useSetRecoilState} from 'recoil';
import {participantsSortOrderAtom} from '../state/state';

const useSetParticipantsSortOrder = () => {
  const setParticipantsSortOrder = useSetRecoilState(participantsSortOrderAtom);

  return useCallback(
    (userId: string) => {
      setParticipantsSortOrder(participantIds => {
        if (userId === participantIds[0] || userId === participantIds[1]) {
          return participantIds;
        }

        return [userId, ...reject(whereEq(userId), participantIds)];
      });
    },
    [setParticipantsSortOrder],
  );
};

export default useSetParticipantsSortOrder;
