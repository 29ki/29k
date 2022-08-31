import React from 'react';
import IconButton from '../../../common/components/Buttons/IconButton/IconButton';
import {MicrophoneIcon} from '../../../common/components/Icons';
import {MicrophoneOffIcon} from '../../../common/components/Icons';

type AudioToggleButton = {
  onPress: () => void;
  active: boolean;
};

const AudioToggleButton: React.FC<AudioToggleButton> = ({onPress, active}) => (
  <IconButton
    Icon={active ? MicrophoneIcon : MicrophoneOffIcon}
    onPress={onPress}
    active={active}
  />
);

export default AudioToggleButton;
