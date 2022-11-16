import React, {useMemo} from 'react';
import SETTINGS from '../../../common/constants/settings';
import {BottomSheetBackgroundProps} from '@gorhom/bottom-sheet';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import useModalState from '../state/state';

const ModalBackground: React.FC<BottomSheetBackgroundProps> = ({
  animatedPosition,
  style,
}) => {
  const backgroundColor = useModalState(state => state.backgroundColor);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      animatedPosition.value,
      [200, 0],
      [SETTINGS.BORDER_RADIUS.MODALS, 0],
      Extrapolate.CLAMP,
    );

    const shadowOpacity = interpolate(
      animatedPosition.value,
      [200, 0],
      [0.16, 0],
      Extrapolate.CLAMP,
    );

    const elevation = interpolate(
      animatedPosition.value,
      [200, 0],
      [12, 0],
      Extrapolate.CLAMP,
    );

    return {
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      shadowOpacity,
      elevation,
    };
  });

  const containerStyle = useMemo(
    () => [style, {backgroundColor}, containerAnimatedStyle],
    [style, backgroundColor, containerAnimatedStyle],
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default ModalBackground;
