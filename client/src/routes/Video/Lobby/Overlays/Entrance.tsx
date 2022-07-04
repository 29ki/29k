import React, {useContext} from 'react';
import {Button} from 'react-native';
import styled from 'styled-components/native';

import {DailyContext} from '../../DailyProvider';

const EntranceScreen = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Entrance = () => {
  const {startMeeting} = useContext(DailyContext);

  const onJoinPress = () => {
    startMeeting();
  };

  return (
    <EntranceScreen>
      <Button title="Start meeting" onPress={onJoinPress} />
    </EntranceScreen>
  );
};

export default Entrance;
