import {reject, whereEq} from 'ramda';
import {useCallback} from 'react';
import {useSetRecoilState} from 'recoil';
import {activeParticipantsAtom} from '../state/state';

const useSetActiveParticipants = () => {
  const setActiveParticipants = useSetRecoilState(activeParticipantsAtom);

  return useCallback(
    (userId: string) => {
      setActiveParticipants(participantIds => {
        console.log(participantIds, userId);

        if (userId === participantIds[0] || userId === participantIds[1]) {
          return participantIds;
        }

        return [userId, ...reject(whereEq(userId), participantIds)];
      });
    },
    [setActiveParticipants],
  );
};

export default useSetActiveParticipants;
