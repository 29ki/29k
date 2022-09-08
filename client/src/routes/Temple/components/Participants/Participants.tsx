import React, {useState} from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {DailyParticipant} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';
import {curry} from 'ramda';

import Participant from './Participant';

const VIDEO_WIDTH_PERCENTAGE = 0.4;

const ParticipantsWrapper = styled.View({
  flex: 1,
});

const VideoView = styled.View<{width: number}>(props => ({
  width: props.width,
}));

type ParticipantsProps = {
  participants: Array<DailyParticipant>;
};

const Participants: React.FC<ParticipantsProps> = ({participants}) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const renderVideo = curry(
    (width: number, {item}: ListRenderItemInfo<DailyParticipant>) => (
      <VideoView width={width}>
        <Participant participant={item} />
      </VideoView>
    ),
  );

  return (
    <ParticipantsWrapper
      onLayout={event => {
        setContainerWidth(event.nativeEvent.layout.width);
      }}>
      <FlatList
        horizontal
        data={participants}
        keyExtractor={participant => participant.user_id}
        renderItem={renderVideo(
          participants.length <= 2
            ? containerWidth * (1 / participants.length)
            : containerWidth * VIDEO_WIDTH_PERCENTAGE,
        )}
        scrollEnabled={participants.length > 2}
      />
    </ParticipantsWrapper>
  );
};

export default Participants;
