import React from 'react';
import {ViewStyle} from 'react-native';
import styled from 'styled-components/native';
import {MicrophoneIcon} from '../../../components/Icons/Microphone/Microphone';
import {MicrophoneOffIcon} from '../../../components/Icons/MicrophoneOff/MicrophoneOff';

import {COLORS} from '../../../../../../shared/src/constants/colors';

const Wrapper = styled.View({
  height: 24,
  width: 24,
  borderRadius: 45,
  backgroundColor: COLORS.BLACK_TRANSPARENT,
  padding: 2,
});

export type AudioIndicatorProps = {muted: boolean; style?: ViewStyle};

const AudioIndicator: React.FC<AudioIndicatorProps> = ({
  muted = false,
  style,
}) => (
  <Wrapper style={style}>
    {muted ? (
      <MicrophoneOffIcon fill={COLORS.PURE_WHITE} />
    ) : (
      <MicrophoneIcon fill={COLORS.ACTION} />
    )}
  </Wrapper>
);

export default React.memo(AudioIndicator);
