import React from 'react';
import {Platform, ScrollViewProps, StyleSheet} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import styled from 'styled-components/native';

const StyledScrollView = styled(Animated.ScrollView)({
  ...StyleSheet.absoluteFillObject,
});

const HeaderContainer = styled(Animated.View)<{aspectRatio: number}>(
  ({aspectRatio}) => ({
    aspectRatio,
  }),
);

type Props = ScrollViewProps & {
  headerAspectRatio?: number;
  header: React.ReactNode;
  children: React.ReactNode;
};
const HeaderScrollView: React.FC<Props> = ({
  header,
  headerAspectRatio = 1,
  children,
  ...scrollViewProps
}) => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: e => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [-100, 0], [-50, 0], {
          extrapolateRight: Extrapolation.CLAMP,
        }),
      },
      {
        scale: interpolate(
          scrollY.value,
          [-100 / headerAspectRatio, 0],
          [1.25, 1],
          {
            extrapolateRight: Extrapolation.CLAMP,
          },
        ),
      },
    ],
  }));

  return (
    <>
      <StyledScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        {...scrollViewProps}>
        <HeaderContainer style={headerStyle} aspectRatio={headerAspectRatio}>
          {header}
        </HeaderContainer>
        {children}
      </StyledScrollView>
    </>
  );
};

export default HeaderScrollView;
