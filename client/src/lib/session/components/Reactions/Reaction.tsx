import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Reaction as ReactionProps} from '../../state/state';
import {HeartFillIcon} from '../../../components/Icons';
import {Body12} from '../../../components/Typography/Body/Body';

const {height: windowHeight} = Dimensions.get('window');

const Content = styled(Animated.View)({
  position: 'absolute',
  width: '15%',
  aspectRatio: 1,
  alignItems: 'center',
});

const Name = styled(Body12)({
  maxWidth: '200%',
  paddingHorizontal: 4,
  borderRadius: 6,
  backgroundColor: COLORS.WHITE,
  flexGrow: 1,
  overflow: 'hidden',
});

const Reaction: React.FC<ReactionProps> = ({type, name}) => {
  const scale = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(Math.random() * 0.2 + 0.8, {
      duration: Math.random() * 4000 + 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    translateX.value = withTiming(Math.random() * 100 - 50, {
      duration: 3000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    translateY.value = withTiming(-(windowHeight * 0.6), {
      duration: Math.random() * 4000 + 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    opacity.value = withDelay(
      Math.random() * 2000 + 1000,
      withTiming(0, {
        duration: 1500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
    );
  }, [scale, translateY, translateX, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [
      {translateY: translateY.value},
      {translateX: translateX.value},
      {scale: scale.value},
    ],
    opacity: opacity.value,
  }));

  return (
    <Content style={style}>
      {type === 'heart' && <HeartFillIcon fill={COLORS.HEART} />}
      <Name numberOfLines={1}>{name}</Name>
    </Content>
  );
};

export default React.memo(Reaction);
