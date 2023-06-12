import React, {useCallback, useContext, useEffect} from 'react';
import {DailyEventObject} from '@daily-co/react-native-daily-js';
import {View, ViewStyle} from 'react-native';

import {DailyContext} from '../../../daily/DailyProvider';
import useSessionState from '../../state/state';
import Reaction from './Reaction';

const SessionReactions: React.FC<{
  style?: ViewStyle;
}> = ({style}) => {
  const {call} = useContext(DailyContext);
  const reactions = useSessionState(state => state.reactions);
  const addReaction = useSessionState(state => state.addReaction);

  const appMessage = useCallback(
    (event: DailyEventObject<'app-message'> | undefined) => {
      const message = event?.data;

      if (message?.type === 'reaction') {
        addReaction({
          type: message?.payload?.type,
          name: message?.payload?.name,
        });
      }
    },
    [addReaction],
  );

  useEffect(() => {
    call?.on('app-message', appMessage);

    return () => {
      call?.off('app-message', appMessage);
    };
  }, [call, appMessage]);

  return (
    <View style={style} pointerEvents="none">
      {reactions.map((reaction, i) => (
        <Reaction key={i} type={reaction.type} name={reaction.name} />
      ))}
    </View>
  );
};

export default React.memo(SessionReactions);
