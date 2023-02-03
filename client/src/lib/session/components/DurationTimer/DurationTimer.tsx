import React, {forwardRef} from 'react';

import timer60s from '../../../../assets/animations/60s-timer.json';
import {ViewStyle} from 'react-native';
import LottiePlayer, {
  LottiePlayerHandle,
} from '../../../components/LottiePlayer/LottiePlayer';

type DurationTimerProps = {
  style?: ViewStyle;
  paused: boolean;
  duration: number;
};

const DurationTimer = forwardRef<LottiePlayerHandle, DurationTimerProps>(
  ({style, paused, duration = 60}, ref) => {
    return (
      <LottiePlayer
        style={style}
        duration={duration}
        ref={ref}
        paused={paused}
        source={timer60s}
        repeat={false}
      />
    );
  },
);

export default DurationTimer;
