import React, {useState} from 'react';
import {FlatList, ListRenderItemInfo} from 'react-native';
import {
  DailyMediaView,
  DailyParticipant,
} from '@daily-co/react-native-daily-js';
import styled from 'styled-components/native';
import {useTranslation} from 'react-i18next';

import {B2} from '../../common/components/Typography/Text/Text';
import {COLORS} from '../../common/constants/colors';
import {SPACINGS} from '../../common/constants/spacings';
import {MicrophoneIcon} from '../../common/components/Icons/Microphone/Microphone';
import {MicrophoneOffIcon} from '../../common/components/Icons/MicrophoneOff/MicrophoneOff';
import NS from '../../lib/i18n/constants/namespaces';
import {useSetRecoilState} from 'recoil';
import {selectedParticipantIdAtom} from './state/state';

const ParticipantsWrapper = styled.View({
  flex: 1,
});

const VideoView = styled.TouchableOpacity<{width: number}>(props => ({
  width: props.width,
}));

const ParticipantName = styled(B2)({
  position: 'absolute',
  bottom: 0,
  color: COLORS.WHITE,
  paddingVertical: SPACINGS.EIGHT,
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const ParticipantAudioWrapper = styled.View({
  height: 24,
  width: 24,
  borderRadius: 45,
  backgroundColor: COLORS.BLACK_TRANSPARENT,
  padding: 2,
  position: 'absolute',
  top: SPACINGS.EIGHT,
  right: SPACINGS.SIXTEEN,
});

const DailyMediaViewWrapper = styled(DailyMediaView)({
  flex: 1,
});

type ParticipantsProps = {
  participants: Array<DailyParticipant>;
  localAudioOn: boolean;
};

const audioOn = (participant: DailyParticipant, localAudio: boolean) =>
  participant.local ? localAudio : participant.audio;

const Participants: React.FC<ParticipantsProps> = ({
  participants,
  localAudioOn,
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const setSelectedParticipantId = useSetRecoilState(selectedParticipantIdAtom);
  const {t} = useTranslation(NS.SCREEN.TEMPLE);

  const renderName = (participant: DailyParticipant) =>
    participant.local
      ? `${participant.user_name} (${t('nameSuffix')})`
      : participant.user_name;

  const renderVideo = ({item}: ListRenderItemInfo<DailyParticipant>) => (
    <VideoView
      width={containerWidth * 0.4}
      onPress={() => setSelectedParticipantId(item.user_id)}>
      <DailyMediaViewWrapper
        videoTrack={item.videoTrack ?? null}
        audioTrack={item.audioTrack ?? null}
        objectFit="cover"
        zOrder={item.local ? 1 : 0}
        mirror={item.local}
      />
      <ParticipantName>{renderName(item)}</ParticipantName>
      <ParticipantAudioWrapper>
        {audioOn(item, localAudioOn) ? (
          <MicrophoneIcon fill={COLORS.GREEN_LIGHT} />
        ) : (
          <MicrophoneOffIcon />
        )}
      </ParticipantAudioWrapper>
    </VideoView>
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
        renderItem={renderVideo}
      />
    </ParticipantsWrapper>
  );
};

export default Participants;
