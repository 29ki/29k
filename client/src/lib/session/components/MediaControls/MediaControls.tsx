import React from 'react';
import styled from 'styled-components/native';
import IconButton from '../../../components/Buttons/IconButton/IconButton';
import {Backward15, Forward15, Pause, Play} from '../../../components/Icons';
import {Spacer16, Spacer32, Spacer8} from '../../../components/Spacers/Spacer';
import {View} from 'react-native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Body14} from '../../../components/Typography/Body/Body';
import Gutters from '../../../components/Gutters/Gutters';
import {SPACINGS} from '../../../constants/spacings';
import useSessionState from '../../state/state';
import TimeProgressBar from './TimeProgressBar';

const Wrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const ProgressWrapper = styled.View({
  flexDirection: 'row',
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const TimeWrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: SPACINGS.SIXTEEN,
});

const TimeLabel = styled(Body14)<{color?: string}>(({color}) => ({
  color: color ? color : COLORS.BLACK,
}));

const Progress = styled(TimeProgressBar)({
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
  const theme = useSessionState(state => state.exercise?.theme);
  const timeMinutes = Math.floor(time / 60);
  const timeSeconds = Math.round(time - timeMinutes * 60);
  const left = duration - time;
  const leftMinutes = Math.floor(left / 60);
  const leftSeconds = Math.round(left - leftMinutes * 60);

  const displayTime = `${timeMinutes}:${
    timeSeconds < 10 ? '0' + timeSeconds.toString() : timeSeconds
  }`;
  const displayLeft = `-${leftMinutes}:${
    leftSeconds < 10 ? '0' + leftSeconds.toString() : leftSeconds
  }`;

  return (
    <View>
      <Gutters>
        <ProgressWrapper>
          <Progress color={theme?.textColor} index={time} length={duration} />
        </ProgressWrapper>
        <Spacer8 />
        <TimeWrapper>
          <TimeLabel color={theme?.textColor}>{displayTime}</TimeLabel>
          <TimeLabel color={theme?.textColor}>{displayLeft}</TimeLabel>
        </TimeWrapper>
        <Spacer16 />
        <Wrapper>
          <IconButton
            small
            variant="tertiary"
            Icon={Backward15}
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
            Icon={Forward15}
            onPress={onSkipForward}
          />
        </Wrapper>
      </Gutters>
    </View>
  );
};

export default MediaControls;
