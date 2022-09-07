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
import {H1} from '../../common/components/Typography/Heading/Heading';

const VIDEO_WIDTH_PERCENTAGE = 0.4;

const ParticipantsWrapper = styled.View({
  flex: 1,
});

const VideoView = styled.TouchableOpacity<{width: number}>(props => ({
  width: props.width,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: COLORS.BLACK_EASY,
}));

const DailyMediaViewWrapper = styled(DailyMediaView)({
  height: '100%',
  width: '100%',
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

const ParticipantPlaceholder = styled.View({
  backgroundColor: COLORS.CREAM500,
  borderRadius: SPACINGS.SIXTEEN,
  width: 80,
  height: 80,
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  justifySelf: 'center',
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
        {item.videoTrack ? (
          <DailyMediaViewWrapper
            videoTrack={item.videoTrack ?? null}
            audioTrack={item.audioTrack ?? null}
            objectFit="cover"
            zOrder={item.local ? 1 : 0}
            mirror={item.local}
          />
        ) : (
          <ParticipantPlaceholder>
            <H1>{item?.user_name?.[0]}</H1>
          </ParticipantPlaceholder>
        )}
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
