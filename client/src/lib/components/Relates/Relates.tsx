import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {Body16} from '../Typography/Body/Body';
import {Spacer4} from '../Spacers/Spacer';
import {HKGroteskMedium} from '../../constants/fonts';
import Gem from './Gem';

const Container = styled.View({
  paddingVertical: 2,
  paddingHorizontal: 8,
  backgroundColor: COLORS.PURE_WHITE,
  borderRadius: 12.8,
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
  zIndex: 1,
});

const Text = styled(Body16)({
  height: 18,
  fontFamily: HKGroteskMedium,
  lineHeight: 19,
  color: COLORS.GREYDARK,
});

type RelatesProps = {
  count?: number;
};
const Relates = ({count = 0}: RelatesProps) => {
  const prevCount = useRef<undefined | number>();

  const gemScale = useSharedValue(1);
  const gemStyle = useAnimatedStyle(() => ({
    transform: [{scale: gemScale.value}],
  }));

  useEffect(() => {
    // Do not animate on mount or decrease
    if (count && prevCount.current !== undefined && prevCount.current < count) {
      gemScale.value = withSequence(
        withTiming(2, {
          duration: 800,
          easing: Easing.bounce,
        }),
        withDelay(500, withTiming(1, {duration: 200})),
      );
    }

    prevCount.current = count;
  }, [gemScale, count]);

  return (
    <Container>
      <Gem style={gemStyle} />
      {Boolean(count) && (
        <>
          <Spacer4 />
          <Text>{count}</Text>
        </>
      )}
    </Container>
  );
};

export default Relates;
