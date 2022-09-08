import React from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {MicrophoneIcon} from '../../../../common/components/Icons/Microphone/Microphone';
import {MicrophoneOffIcon} from '../../../../common/components/Icons/MicrophoneOff/MicrophoneOff';

import {COLORS} from '../../../../common/constants/colors';

const Wrapper = styled.View({
  height: 24,
  width: 24,
  borderRadius: 45,
  backgroundColor: COLORS.BLACK_TRANSPARENT,
  padding: 2,
});

type AudioIndicatorProps = {muted: boolean; style?: ViewStyle};

const AudioIndicator: React.FC<AudioIndicatorProps> = ({
  muted = false,
  style,
}) => (
  <Wrapper style={style}>
    {muted ? (
      <MicrophoneOffIcon fill={COLORS.WHITE} />
    ) : (
      <MicrophoneIcon fill={COLORS.GREEN_LIGHT} />
    )}
  </Wrapper>
);

export default AudioIndicator;
