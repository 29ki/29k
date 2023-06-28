import React from 'react';
import {View} from 'react-native';
import styled from 'styled-components/native';
import IconButton from '../Buttons/IconButton/IconButton';

import {Backward15, Forward15, Pause, Play, SubtitlesIcon} from '../Icons';
import {Spacer16, Spacer32, Spacer8} from '../Spacers/Spacer';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {Body14} from '../Typography/Body/Body';
import {SPACINGS} from '../../constants/spacings';
import useSessionState from '../../session/state/state';
import TimeProgressBar from './TimeProgressBar';

const Wrapper = styled.View({
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const ControlsWrapper = styled.View({
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
});

const ProgressWrapper = styled.View({
  flexDirection: 'row',
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

const SubtitlesWrapper = styled.View({
  position: 'absolute',
  right: 0,
});

type MediaControlsProps = {
  time: number;
  duration: number;
  playing: boolean;
  subtitles?: boolean;
  onSkipForward: () => void;
  onSkipBack: () => void;
  onTogglePlay: () => void;
  onToggleSubtitles?: () => void;
  light?: boolean;
};

const MediaControls: React.FC<MediaControlsProps> = ({
  time,
  duration,
  playing,
  subtitles,
  onSkipForward,
  onSkipBack,
  onTogglePlay,
  onToggleSubtitles,
  light,
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

  const variant = light ? 'secondary' : 'tertiary';

  return (
    <View>
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
        <ControlsWrapper>
          <IconButton
            small
            variant={variant}
            Icon={Backward15}
            onPress={onSkipBack}
          />
          <Spacer32 />
          <PlayPauseButton
            variant={variant}
            Icon={playing ? Pause : Play}
            onPress={onTogglePlay}
          />
          <Spacer32 />
          <IconButton
            small
            variant={variant}
            Icon={Forward15}
            onPress={onSkipForward}
          />
          {subtitles !== undefined && onToggleSubtitles && (
            <SubtitlesWrapper>
              {subtitles ? (
                <IconButton
                  small
                  variant={variant}
                  fill={COLORS.PRIMARY}
                  Icon={SubtitlesIcon}
                  onPress={onToggleSubtitles}
                />
              ) : (
                <IconButton
                  small
                  variant={variant}
                  Icon={SubtitlesIcon}
                  onPress={onToggleSubtitles}
                />
              )}
            </SubtitlesWrapper>
          )}
        </ControlsWrapper>
      </Wrapper>
    </View>
  );
};

export default MediaControls;
