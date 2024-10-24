import React, {useCallback, useEffect} from 'react';
import styled from 'styled-components/native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import TouchableOpacity from '../../components/TouchableOpacity/TouchableOpacity';

import {COLORS} from '../../../../../shared/src/constants/colors';

const Container = styled(Animated.View)({
  marginVertical: 6,
  height: 12,
  width: 38,
  borderRadius: 45,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: 'red',
});

const IconWrapper = styled(Animated.View)({
  height: 24,
  width: 24,
  borderRadius: 45,
  padding: 2,
});

type TogglerProps = {
  toggled: boolean;
  onToggle: (muted: boolean) => void;
  disabled?: boolean;
  ToggledIcon: React.ElementType;
  UntoggledIcon: React.ElementType;
};

const Toggler: React.FC<TogglerProps> = ({
  disabled,
  toggled = false,
  onToggle,
  ToggledIcon,
  UntoggledIcon,
}) => {
  const iconOffset = useSharedValue(toggled ? 14 : 0);
  const backgroundOpacity = useSharedValue(toggled ? 0 : 1);
  const iconBackground = useSharedValue(toggled ? 0 : 255);
  const iconBackgroundOpacity = useSharedValue(toggled ? 0.5 : 1);

  const iconAnimatedStyles = useAnimatedStyle(
    () => ({
      transform: [{translateX: iconOffset.value}],
      backgroundColor: `rgba(${iconBackground.value}, ${iconBackground.value}, ${iconBackground.value}, ${iconBackgroundOpacity.value})`,
    }),
    [iconOffset, iconBackground, iconBackgroundOpacity],
  );

  const containerAnimatedStyles = useAnimatedStyle(
    () => ({
      backgroundColor: `rgba(42, 226, 215, ${backgroundOpacity.value})`,
    }),
    [backgroundOpacity],
  );

  const onPress = useCallback(() => {
    onToggle(!toggled);
  }, [onToggle, toggled]);

  useEffect(() => {
    iconOffset.value = withTiming(toggled ? 14 : 0, {easing: Easing.ease});
    backgroundOpacity.value = withTiming(toggled ? 0 : 1, {
      easing: Easing.ease,
    });
    iconBackground.value = withTiming(toggled ? 0 : 255, {
      easing: Easing.ease,
    });
    iconBackgroundOpacity.value = withTiming(toggled ? 0.5 : 1, {
      easing: Easing.ease,
    });
  }, [
    toggled,
    iconOffset,
    backgroundOpacity,
    iconBackground,
    iconBackgroundOpacity,
  ]);

  return (
    <TouchableOpacity disabled={disabled} activeOpacity={1} onPress={onPress}>
      <Container style={containerAnimatedStyles}>
        <IconWrapper style={iconAnimatedStyles}>
          {toggled ? (
            <UntoggledIcon fill={COLORS.PURE_WHITE} />
          ) : (
            <ToggledIcon fill={COLORS.ACTION} />
          )}
        </IconWrapper>
      </Container>
    </TouchableOpacity>
  );
};

export default React.memo(Toggler);
