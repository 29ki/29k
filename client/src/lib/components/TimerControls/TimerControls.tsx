import React from 'react';
import styled from 'styled-components/native';
import IconButton from '../Buttons/IconButton/IconButton';

import {PauseIcon, PlayIcon, RewindIcon} from '../Icons';
import {Spacer8} from '../Spacers/Spacer';
import SETTINGS from '../../constants/settings';

const Wrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
});

type MediaControlsProps = {
  playing: boolean;
  disabled?: boolean;
  onReset: () => void;
  onTogglePlay: () => void;
};

const IconSlideButton = styled(IconButton)<{hidden?: boolean}>(({hidden}) => ({
  opacity: hidden ? 0 : 1,
  ...SETTINGS.BOXSHADOW_SMALL,
}));

const TimerControls: React.FC<MediaControlsProps> = ({
  playing,
  disabled,
  onReset,
  onTogglePlay,
}) => {
  return (
    <Wrapper>
      <IconSlideButton
        size="small"
        disabled={disabled}
        variant="tertiary"
        Icon={RewindIcon}
        onPress={onReset}
      />
      <Spacer8 />
      <IconSlideButton
        size="small"
        disabled={disabled}
        variant="tertiary"
        Icon={playing ? PauseIcon : PlayIcon}
        onPress={onTogglePlay}
      />
    </Wrapper>
  );
};

export default TimerControls;
