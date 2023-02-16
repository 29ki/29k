import React, {useEffect} from 'react';
import {ViewStyle} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../../constants/spacings';

const Wrapper = styled.View({
  flexDirection: 'row',
  backgroundColor: COLORS.BLACK_TRANSPARENT_30,
  borderRadius: SPACINGS.EIGHT,
  height: SPACINGS.FOUR,
  overflow: 'hidden',
});

const Fill = styled(Animated.View)({
  backgroundColor: COLORS.BLACK,
  borderRadius: SPACINGS.EIGHT,
  minWidth: 6,
});

const Progress: React.FC<{percentage: number}> = ({percentage}) => {
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

  return <Fill style={style} />;
};

type ProgressBarProps = {
  length?: number;
  index?: number;
  style?: ViewStyle;
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  index = 0,
  length = 1,
  style,
}) => (
  <Wrapper style={style}>
    <Progress percentage={index / (length - 1)} />
  </Wrapper>
);

export default React.memo(ProgressBar);
