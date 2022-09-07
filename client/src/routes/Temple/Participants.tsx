import React, {useState} from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';
import {curry} from 'ramda';

import NS from '../../lib/i18n/constants/namespaces';
import ParticipantName from './ParticipantName';
import AudioIndicator from './components/AudioIdicator';
import {SPACINGS} from '../../common/constants/spacings';
import {COLORS} from '../../common/constants/colors';

const VIDEO_WIDTH_PERCENTAGE = 0.4;

const ParticipantsWrapper = styled.View({
  flex: 1,
});

const VideoView = styled.TouchableOpacity<{width: number}>(props => ({
  width: props.width,
}));

const DailyMediaViewWrapper = styled(DailyMediaView)({
  flex: 1,
});

const ParticipantAudio = styled(AudioIndicator)({
  height: 24,
  width: 24,
  borderRadius: 45,
  backgroundColor: COLORS.BLACK_TRANSPARENT,
  padding: 2,
  position: 'absolute',
  top: SPACINGS.SIXTEEN,
  right: SPACINGS.SIXTEEN,
});

type ParticipantsProps = {
  participants: Array<DailyParticipant>;
};

const Participants: React.FC<ParticipantsProps> = ({participants}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const {t} = useTranslation(NS.SCREEN.TEMPLE);

  const renderVideo = curry(
    (width: number, {item}: ListRenderItemInfo<DailyParticipant>) => (
      <VideoView width={width} onPress={() => {}}>
        <DailyMediaViewWrapper
          videoTrack={item.videoTrack ?? null}
          audioTrack={item.audioTrack ?? null}
          objectFit="cover"
          zOrder={item.local ? 1 : 0}
          mirror={item.local}
        />
        <ParticipantName participant={item} suffix={t('nameSuffix')} />
        <ParticipantAudio muted={!item.audioTrack} />
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
