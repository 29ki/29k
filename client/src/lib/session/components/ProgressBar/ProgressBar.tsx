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
  overflow: 'hidden',
}));

const Fill = styled(Animated.View)<{color?: string}>(({color}) => ({
  backgroundColor: color ? color : COLORS.BLACK,
  borderRadius: SPACINGS.EIGHT,
  minWidth: 6,
}));

const Progress: React.FC<{percentage: number; color?: string}> = ({
  percentage,
  color,
}) => {
  const width = useSharedValue(percentage);

  const style = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  useEffect(() => {
    width.value = withTiming(percentage, {
      duration: 500,
      easing: Easing.bezier(0.33, 1, 0.68, 1),
    });
  }, [width, percentage]);

  return <Fill color={color} style={style} />;
};

type ProgressBarProps = {
  length?: number;
  index?: number;
  empty?: boolean;
  color?: string;
  style?: ViewStyle;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  index = 0,
  length = 1,
  empty,
  color,
  style,
}) => (
  <Wrapper color={color} style={style}>
    <Progress color={color} percentage={empty ? 0 : (index + 1) / length} />
  </Wrapper>
);

export default React.memo(ProgressBar);
