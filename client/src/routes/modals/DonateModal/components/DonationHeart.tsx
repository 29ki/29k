import React, {useEffect} from 'react';
import Animated, {
  Easing,
  createAnimatedPropAdapter,
  interpolateColor,
  processColor,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Path, Svg} from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const mapRange = (
  value: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
) => ((value - xMin) * (yMax - yMin)) / (xMax - xMin) + yMin;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(min, value), max);

const DonationHeart: React.FC<{
  minAmount: number;
  maxAmount: number;
  amount: number;
}> = ({minAmount, maxAmount, amount}) => {
  const size =
    amount > 0
      ? mapRange(
          clamp(amount, minAmount / 2, maxAmount * 2),
          minAmount,
          maxAmount,
          2,
          6,
        )
      : 1;

  const scale = useSharedValue(size);
  const fill = useSharedValue(size);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1, {
        duration: 400,
        easing: Easing.ease,
      }),
      2,
    );
    fill.value = withRepeat(
      withTiming(1, {
        duration: 400,
        easing: Easing.cubic,
      }),
      2,
    );
  }, [amount, size, scale, fill]);

  const svgStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const pathProps = useAnimatedProps(
    () => ({
      fill: interpolateColor(
        fill.value,
        [1, size],
        [COLORS.PURE_WHITE, COLORS.HEART],
      ),
    }),
    [],
    /* fill prop works differently in the native layer and needs to be adapted
       https://github.com/software-mansion/react-native-svg/issues/1845#issuecomment-1247836723 */
    createAnimatedPropAdapter(
      props => {
        props.fill = {type: 0, payload: processColor(props.fill as string)};
      },
      ['fill'],
    ),
  );

  return (
    <AnimatedSvg
      style={svgStyle}
      width="100%"
      height="100%"
      viewBox="0 0 30 30"
      fill="transparent">
      <AnimatedPath
        animatedProps={pathProps}
        d="M14.096 24.683c-5.254-3.58-8.635-7.778-8.635-12.025 0-3.67 2.401-6.217 5.49-6.217 1.799 0 3.211.875 4.04 2.178.847-1.313 2.25-2.178 4.049-2.178 3.08 0 5.48 2.546 5.48 6.217 0 4.247-3.37 8.444-8.635 12.025-.291.199-.65.398-.894.398-.245 0-.603-.2-.895-.398Z"
      />
    </AnimatedSvg>
  );
};

export default React.memo(DonationHeart);
