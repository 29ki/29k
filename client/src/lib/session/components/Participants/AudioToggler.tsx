import React, {useCallback, useEffect} from 'react';
import styled from 'styled-components/native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {MicrophoneIcon} from '../../../components/Icons/Microphone/Microphone';
import {MicrophoneOffIcon} from '../../../components/Icons/MicrophoneOff/MicrophoneOff';
import TouchableOpacity from '../../../components/TouchableOpacity/TouchableOpacity';

import {COLORS} from '../../../../../../shared/src/constants/colors';

const Wrapper = styled(Animated.View)({
  height: 24,
  width: 24,
  borderRadius: 45,
  padding: 2,
});

const Container = styled(Animated.View)({
  height: 12,
  width: 38,
  borderRadius: 45,
  flexDirection: 'row',
  alignItems: 'center',
});

type AudioTogglerProps = {
  muted: boolean;
  onToggle: (muted: boolean) => void;
  allowUnmute?: boolean;
};

const AudioToggler: React.FC<AudioTogglerProps> = ({
  muted = false,
  onToggle,
  allowUnmute = false,
}) => {
  const iconOffset = useSharedValue(0);
  const iconBackground = useSharedValue(0);
  const iconBackgroundOpacity = useSharedValue(0.5);
  const backgroundOpacity = useSharedValue(0);

  const iconAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: iconOffset.value}],
    backgroundColor: `rgba(${iconBackground.value}, ${iconBackground.value}, ${iconBackground.value}, ${iconBackgroundOpacity.value})`,
  }));

  const containerAnimatedStyles = useAnimatedStyle(() => ({
    backgroundColor: `rgba(42, 226, 215, ${backgroundOpacity.value})`,
  }));

  const onPress = useCallback(() => {
    onToggle(!muted);
  }, [onToggle, muted]);

  useEffect(() => {
    iconOffset.value = withTiming(muted ? 14 : 0, {easing: Easing.ease});
    backgroundOpacity.value = withTiming(muted ? 0 : 1, {
      easing: Easing.ease,
    });
    iconBackground.value = withTiming(muted ? 0 : 255, {
      easing: Easing.ease,
    });
    iconBackgroundOpacity.value = withTiming(muted ? 0.5 : 1, {
      easing: Easing.ease,
    });
  }, [
    muted,
    iconOffset,
    backgroundOpacity,
    iconBackground,
    iconBackgroundOpacity,
  ]);

  return (
    <TouchableOpacity
      disabled={!allowUnmute && muted}
      activeOpacity={1}
      onPress={onPress}>
      <Container style={containerAnimatedStyles}>
        <Wrapper style={iconAnimatedStyles}>
          {muted ? (
            <MicrophoneOffIcon fill={COLORS.PURE_WHITE} />
          ) : (
            <MicrophoneIcon fill={COLORS.ACTION} />
          )}
        </Wrapper>
      </Container>
    </TouchableOpacity>
  );
};

export default React.memo(AudioToggler);
