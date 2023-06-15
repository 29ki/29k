import React, {useEffect} from 'react';
import {ViewStyle} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import hexToRgba from 'hex-to-rgba';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';

const Wrapper = styled.View<{color?: string}>(({color}) => ({
  flexDirection: 'row',
  backgroundColor: color ? hexToRgba(color, 0.5) : COLORS.BLACK_TRANSPARENT_30,
  borderRadius: SPACINGS.EIGHT,
  height: SPACINGS.FOUR,
}));

const Fill = styled(Animated.View)<{color?: string}>(({color}) => ({
  backgroundColor: color ? color : COLORS.BLACK,
  borderRadius: SPACINGS.EIGHT,
  minWidth: 6,
}));

const Dot = styled(Animated.View)<{color?: string}>(({color}) => ({
  position: 'absolute',
  top: '-100%',
  backgroundColor: color ? color : COLORS.BLACK,
  borderRadius: SPACINGS.TWENTYFOUR,
  height: 12,
  width: 12,
}));

const Progress: React.FC<{percentage: number; color?: string}> = ({
  percentage,
  color,
}) => {
  const width = useSharedValue(percentage);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  const dotStyle = useAnimatedStyle(() => ({
    left: `${width.value * 100}%`,
  }));

  useEffect(() => {
    width.value = withTiming(percentage, {
      duration: 100,
      easing: Easing.bezier(0.33, 1, 0.68, 1),
    });
  }, [width, percentage]);

  return (
    <>
      <Fill color={color} style={fillStyle} />
      <Dot color={color} style={dotStyle} />
    </>
  );
};

type TimeProgressBarProps = {
  length?: number;
  index?: number;
  color?: string;
  style?: ViewStyle;
};

const TimeProgressBar: React.FC<TimeProgressBarProps> = ({
  index = 0,
  length = 1,
  color,
  style,
}) => (
  <>
    <Wrapper color={color} style={style}>
      <Progress color={color} percentage={index / (length - 1)} />
    </Wrapper>
  </>
);

export default React.memo(TimeProgressBar);
