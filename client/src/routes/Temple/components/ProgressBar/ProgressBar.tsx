import React, {useEffect} from 'react';
import {View} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';
import {COLORS} from '../../../../common/constants/colors';
import {SPACINGS} from '../../../../common/constants/spacings';

const Wrapper = styled.View({
  flexDirection: 'row',
  backgroundColor: COLORS.GREY200,
  borderRadius: SPACINGS.EIGHT,
  height: SPACINGS.FOUR,
  overflow: 'hidden',
  width: '100%',
});

const Bar = styled(View)({flex: 1});

const Fill = styled(Animated.View)({
  backgroundColor: COLORS.BLACK,
  flex: 1,
});

const Block: React.FC<{fill: boolean}> = ({fill}) => {
  const width = useSharedValue(fill ? '100%' : '0%');

  const style = useAnimatedStyle(() => ({
    width: width.value,
  }));

  useEffect(() => {
    width.value = withTiming(fill ? '100%' : '0%', {
      duration: 500,
      easing: Easing.bezier(0.33, 1, 0.68, 1),
    });
  }, [width, fill]);

  return (
    <Bar>
      <Fill style={style} />
    </Bar>
  );
};

type ProgressBarProps = {
  length?: number;
  index?: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({index = 0, length = 1}) => (
  <Wrapper>
    {Array(length - 1)
      .fill('')
      .map((_, idx) => (
        <Block key={idx} fill={idx < index} />
      ))}
  </Wrapper>
);

export default ProgressBar;
