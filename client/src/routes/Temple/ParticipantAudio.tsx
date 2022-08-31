import {DailyParticipant} from '@daily-co/react-native-daily-js';
import React from 'react';
import styled from 'styled-components/native';

import {MicrophoneIcon} from '../../common/components/Icons/Microphone/Microphone';
import {MicrophoneOffIcon} from '../../common/components/Icons/MicrophoneOff/MicrophoneOff';
import {COLORS} from '../../common/constants/colors';
import {SPACINGS} from '../../common/constants/spacings';

type ParticipantAudioWrappeType = {
  isOnThumbnail: boolean;
};

type ParticipantAduioType = ParticipantAudioWrappeType & {
  participant: DailyParticipant;
  localAudioOn: boolean;
};

const ParticipantAudioWrapper = styled.View<ParticipantAudioWrappeType>(
  ({isOnThumbnail}) => ({
    height: 24,
    width: 24,
    borderRadius: 45,
    backgroundColor: COLORS.BLACK_TRANSPARENT,
    padding: 2,
    position: 'absolute',
    top: isOnThumbnail ? SPACINGS.EIGHT : SPACINGS.FIFTYSIX,
    right: isOnThumbnail ? SPACINGS.SIXTEEN : undefined,
    left: isOnThumbnail ? undefined : SPACINGS.SIXTEEN,
  }),
);

const audioOn = (participant: DailyParticipant, localAudio: boolean) =>
  participant.local ? localAudio : participant.audio;

export const ParticipantAudio: React.FC<ParticipantAduioType> = ({
  isOnThumbnail = true,
  participant,
  localAudioOn,
}) => (
  <ParticipantAudioWrapper isOnThumbnail={isOnThumbnail}>
    {audioOn(participant, localAudioOn) ? (
      <MicrophoneIcon fill={COLORS.GREEN_LIGHT} />
    ) : (
      <MicrophoneOffIcon />
    )}
  </ParticipantAudioWrapper>
);
