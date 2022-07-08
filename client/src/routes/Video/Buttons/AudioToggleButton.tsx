import React from 'react';
import styled from 'styled-components/native';
import IconButton from '../../../common/components/Buttons/IconButton/IconButton';
import {MicrophoneIcon} from '../../../common/components/Icons/Microphone/Microphone';
import {MicrophoneOffIcon} from '../../../common/components/Icons/MicrophoneOff/MicrophoneOff';
import {COLORS} from '../../../common/constants/colors';

const Container = styled.View({
  margin: 'auto',
  borderRadius: 25,
  backgroundColor: COLORS.GREY,
});

type AudioToggleButton = {
  onPress: () => void;
  active: boolean;
};

const AudioToggleButton: React.FC<AudioToggleButton> = ({onPress, active}) => (
  <Container>
    <IconButton
      Icon={active ? MicrophoneIcon : MicrophoneOffIcon}
      fill={active ? COLORS.SUCCESS_GREEN : COLORS.ERROR_PINK}
      onPress={onPress}
    />
  </Container>
);

export default AudioToggleButton;
