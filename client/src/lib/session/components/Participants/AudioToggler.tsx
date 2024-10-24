import React from 'react';

import {MicrophoneIcon} from '../../../components/Icons/Microphone/Microphone';
import {MicrophoneOffIcon} from '../../../components/Icons/MicrophoneOff/MicrophoneOff';

import Toggler from '../../../components/Toggler/Toggler';

type AudioTogglerProps = {
  muted: boolean;
  onToggle: (muted: boolean) => void;
  allowUnmute?: boolean;
};

const AudioToggler: React.FC<AudioTogglerProps> = ({
  muted = false,
  onToggle,
  allowUnmute = false,
}) => (
  <Toggler
    disabled={!allowUnmute && muted}
    onToggle={onToggle}
    toggled={muted}
    ToggledIcon={MicrophoneOffIcon}
    UntoggledIcon={MicrophoneIcon}
  />
);

export default React.memo(AudioToggler);
