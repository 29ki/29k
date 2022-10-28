import React, {useEffect, useState} from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {DailyParticipant} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';
import {curry} from 'ramda';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';

import Participant from './Participant';
import {Body14} from '../../../../common/components/Typography/Body/Body';
import {SPACINGS} from '../../../../common/constants/spacings';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import * as NS from '../../../../../../shared/src/constants/namespaces';

const VIDEO_WIDTH_PERCENTAGE = 0.4;

const ParticipantsWrapper = styled.View({
  flex: 1,
});

const VideoView = styled.View<{width: number}>(props => ({
  width: props.width,
}));

const MessageWrapper = styled(Animated.View).attrs({
  entering: FadeIn.duration(300),
  exiting: FadeOut.duration(300),
})({
  position: 'absolute',
  bottom: SPACINGS.TWENTYEIGHT,
  right: SPACINGS.SIXTEEN,
  paddingVertical: SPACINGS.FOUR,
  paddingHorizontal: SPACINGS.FOUR,
  borderRadius: SPACINGS.EIGHT,
  backgroundColor: COLORS.WHITE_TRANSPARENT_7,
});

type ParticipantsProps = {
  participants: Array<DailyParticipant>;
};

const Participants: React.FC<ParticipantsProps> = ({participants}) => {
  const {t} = useTranslation(NS.SCREEN.SESSION);
  const [containerWidth, setContainerWidth] = useState(0);
  const [numberOfParticipants, setNumberOfParticipants] = useState(
    participants.length,
  );
  const [joinMessage, setJoinMessage] = useState('');

  const renderVideo = curry(
    (width: number, {item}: ListRenderItemInfo<DailyParticipant>) => (
      <VideoView width={width}>
        <Participant participant={item} />
      </VideoView>
    ),
  );

  useEffect(() => {
    if (participants.length < 2) {
      return;
    }
    if (participants.length > numberOfParticipants) {
      setNumberOfParticipants(participants.length);
      setJoinMessage(
        t('participant.joined', {
          user: participants[participants.length - 1].user_name,
        }),
      );
      setTimeout(() => {
        setJoinMessage('');
      }, 4000);
      return clearTimeout(joinMessage);
    }
    if (participants.length < numberOfParticipants) {
      setNumberOfParticipants(participants.length);
      setJoinMessage(t('participant.left'));
      setTimeout(() => {
        setJoinMessage('');
      }, 4000);
      return clearTimeout(joinMessage);
    }
  }, [participants, numberOfParticipants, joinMessage, t]);

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
      {joinMessage !== '' && (
        <MessageWrapper>
          <Body14>{joinMessage}</Body14>
        </MessageWrapper>
      )}
    </ParticipantsWrapper>
  );
};

export default Participants;
