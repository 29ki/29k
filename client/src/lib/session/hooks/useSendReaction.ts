import throttle from 'lodash.throttle';
import {useContext, useMemo} from 'react';
import useSessionState, {Reaction} from '../state/state';
import {DailyContext} from '../../daily/DailyProvider';
import useLocalParticipant from '../../daily/hooks/useLocalParticipant';
import {DailyUserData} from '../../../../../shared/src/schemas/Session';

const useSendReaction = () => {
  const localParticipant = useLocalParticipant();
  const {sendMessage} = useContext(DailyContext);
  const addReaction = useSessionState(state => state.addReaction);

  const userName = (localParticipant?.userData as DailyUserData)?.userName;

  return useMemo(
    () =>
      throttle((type: Reaction['type']) => {
        sendMessage({type: 'reaction', payload: {type, name: userName}});
        // Daily does not emit to local, so we need to add it manually
        addReaction({type, name: userName});
      }, 1500),
    [sendMessage, addReaction, userName],
  );
};

export default useSendReaction;
