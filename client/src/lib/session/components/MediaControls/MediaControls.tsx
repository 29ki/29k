import React from 'react';
import styled from 'styled-components/native';
import IconButton from '../../../components/Buttons/IconButton/IconButton';
import {Pause, Play, RewindIcon} from '../../../components/Icons';
import {
  BottomSafeArea,
  Spacer16,
  Spacer32,
} from '../../../components/Spacers/Spacer';
import ProgressBar from '../ProgressBar/ProgressBar';
import {View} from 'react-native';

const Wrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const ProgressWrapper = styled.View({
  flexDirection: 'row',
});

const Progress = styled(ProgressBar)({
  flex: 1,
});

const PlayPauseButton = styled(IconButton)({
  height: 54,
  width: 54,
  borderRadius: 24,
});

type MediaControlsProps = {
  time: number;
  duration: number;
  playing: boolean;
  onSkipForward: () => void;
  onSkipBack: () => void;
  onTogglePlay: () => void;
};

const MediaControls: React.FC<MediaControlsProps> = ({
  time,
  duration,
  playing,
  onSkipForward,
  onSkipBack,
  onTogglePlay,
}) => {
  return (
    <View>
      <ProgressWrapper>
        <Spacer32 />
        <Progress index={time} length={duration} />
        <Spacer32 />
      </ProgressWrapper>
      <Spacer16 />
      <Wrapper>
        <IconButton
          small
          variant="tertiary"
          Icon={RewindIcon}
          onPress={onSkipBack}
        />
        <Spacer32 />
        <PlayPauseButton
          variant="tertiary"
          Icon={playing ? Pause : Play}
          onPress={onTogglePlay}
        />
        <Spacer32 />
        <IconButton
          small
          variant="tertiary"
          Icon={RewindIcon}
          onPress={onSkipForward}
        />
      </Wrapper>
    </View>
  );
};

export default MediaControls;
