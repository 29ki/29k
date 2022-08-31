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
import {useSetRecoilState} from 'recoil';
import {selectedParticipantIdAtom} from './state/state';
import ParticipantName from './ParticipantName';
import ParticipantAudio from './ParticipantAudio';

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

type ParticipantsProps = {
  participants: Array<DailyParticipant>;
  localAudioOn: boolean;
};

const Participants: React.FC<ParticipantsProps> = ({
  participants,
  localAudioOn,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const setSelectedParticipantId = useSetRecoilState(selectedParticipantIdAtom);
  const {t} = useTranslation(NS.SCREEN.TEMPLE);

  const renderVideo = curry(
    (width: number, {item}: ListRenderItemInfo<DailyParticipant>) => (
      <VideoView
        width={width}
        onPress={() => setSelectedParticipantId(item.user_id)}>
        <DailyMediaViewWrapper
          videoTrack={item.videoTrack ?? null}
          audioTrack={item.audioTrack ?? null}
          objectFit="cover"
          zOrder={item.local ? 1 : 0}
          mirror={item.local}
        />
        <ParticipantName participant={item} suffix={t('nameSuffix')} />
        <ParticipantAudio
          participant={item}
          localAudioOn={localAudioOn}
          isOnThumbnail
        />
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
            ? containerWidth * 0.5
            : containerWidth * VIDEO_WIDTH_PERCENTAGE,
        )}
      />
    </ParticipantsWrapper>
  );
};

export default Participants;
