import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {TopSafeArea} from '../../../../common/components/Spacers/Spacer';

import {ContentSlide} from '../../../../../../shared/src/types/Content';
import {StyleSheet} from 'react-native';
import {Content} from '../Content/Content';

type ContentProps = {
  content: ContentSlide[];
  contentIndex: number;
  playing: boolean;
};

const Wrapper = styled.View({
  flex: 1,
});

const AnimatedView = styled(Animated.View)({
  ...StyleSheet.absoluteFillObject,
});

const Fade: React.FC<{visible: boolean}> = ({children, visible}) => {
  const opacity = useSharedValue(visible ? 1 : 0);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {duration: 400});
  }, [opacity, visible]);

  return <AnimatedView style={animatedStyles}>{children}</AnimatedView>;
};

const ContentSlides: React.FC<ContentProps> = ({
  content,
  contentIndex = 0,
  playing,
}) => {
  const prevContent = content[contentIndex - 1];
  const currentContent = content[contentIndex];
  const nextContent = content[contentIndex + 1];

  return (
    <>
      <TopSafeArea />
      <Wrapper>
        {prevContent && (
          <Fade visible={false} key={contentIndex - 1}>
            <Content content={prevContent} playing={false} />
          </Fade>
        )}
        <Fade visible={true} key={contentIndex}>
          <Content content={currentContent} playing={playing} />
        </Fade>
        {nextContent && (
          <Fade visible={false} key={contentIndex + 1}>
            <Content content={nextContent} playing={false} />
          </Fade>
        )}
      </Wrapper>
    </>
  );
};

export default ContentSlides;
