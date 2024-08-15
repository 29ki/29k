import React, {useEffect, useRef} from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../shared/src/constants/colors';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {Body16} from '../components/Typography/Body/Body';
import {Spacer4} from '../components/Spacers/Spacer';
import {HKGroteskMedium} from '../constants/fonts';
import Gem from './components/Gem';
import {ViewStyle} from 'react-native';

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
  count: number | null;
  style?: ViewStyle;
};
const Relates = ({count = 0, style}: RelatesProps) => {
  const prevCount = useRef<number | undefined>();

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

    prevCount.current = count || 0;
  }, [gemScale, count]);

  return (
    <Container style={style}>
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

export default React.memo(Relates);
