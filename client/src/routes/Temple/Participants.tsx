import React from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';

import {B2} from '../../common/components/Typography/Text/Text';
import {COLORS} from '../../common/constants/colors';
import {SPACINGS} from '../../common/constants/spacings';

const ParticipatnsWrapper = styled.View({
  height: 184,
  width: '100%',
});

const VideoView = styled.View({
  aspectRatio: '1',
  backgroundColor: 'gray',
});

const ParticipantName = styled(B2)({
  position: 'absolute',
  bottom: 0,
  color: COLORS.WHITE,
  paddingVertical: SPACINGS.EIGHT,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  height: 184,
});

type ParticipantsProps = {
  participants: Array<DailyParticipant>;
};

const Participants: React.FC<ParticipantsProps> = ({participants}) => {
  const renderVideo = ({item}: ListRenderItemInfo<DailyParticipant>) => (
    <VideoView>
      <DailyMediaViewWrapper
        videoTrack={item.videoTrack ?? null}
        audioTrack={item.audioTrack ?? null}
        objectFit={'cover'}
        zOrder={item.local ? 1 : 0}
        mirror={item.local}
      />
      <ParticipantName>{item.user_name}</ParticipantName>
    </VideoView>
  );

  return (
    <ParticipatnsWrapper>
      <FlatList
        bounces={false}
        horizontal
        data={participants}
        keyExtractor={participant => participant.user_id}
        renderItem={renderVideo}
      />
    </ParticipatnsWrapper>
  );
};

export default Participants;
