import React, {useEffect} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {SPACINGS} from '../../constants/spacings';
import {COLORS} from '../../../../../shared/src/constants/colors';

const Fill = styled(Animated.View)<{color?: string}>(({color}) => ({
  backgroundColor: color ? color : COLORS.BLACK,
  borderRadius: SPACINGS.EIGHT,
  minWidth: 6,
  maxWidth: '100%',
}));

const ProgressBar: React.FC<{percentage: number; color?: string}> = ({
  percentage,
  color,
}) => {
  const width = useSharedValue(percentage);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  useEffect(() => {
    width.value = withTiming(percentage, {
      duration: 100,
      easing: Easing.bezier(0.33, 1, 0.68, 1),
    });
  }, [width, percentage]);

  return <Fill color={color} style={fillStyle} />;
};

export default ProgressBar;
