import React from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  useBottomSheet,
} from '@gorhom/bottom-sheet';
import {useMemo} from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {StyleSheet} from 'react-native';

const style = {
  ...StyleSheet.absoluteFillObject,
};

const ModalBackdrop: React.FC<BottomSheetBackdropProps> = ({
  animatedPosition,
  animatedIndex,
}) => {
  const {close} = useBottomSheet();

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedPosition.value,
      [200, 100],
      [COLORS.BLACK, COLORS.CREAM],
    ),
    opacity:
      animatedIndex.value > 0
        ? interpolate(
            animatedPosition.value,
            [200, 0],
            [0.1, 1],
            Extrapolate.CLAMP,
          )
        : interpolate(
            animatedIndex.value,
            [-1, 0],
            [0, 0.1],
            Extrapolate.CLAMP,
          ),
  }));

  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [containerAnimatedStyle],
  );

  return <Animated.View style={containerStyle} />;
};

export default ModalBackdrop;
