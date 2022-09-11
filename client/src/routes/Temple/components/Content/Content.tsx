import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {TopSafeArea} from '../../../../common/components/Spacers/Spacer';
import TextContent from './contentTypes/Text';
import VideoContent from './contentTypes/Video';

import {
  ContentSlide,
  TextContentType,
  VideoContentType,
} from '../../../../../../shared/src/types/Content';
import Facilitator from './contentTypes/Facilitator';
import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../common/constants/colors';

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

const ContentWrapper = styled.View({
  flex: 1,
  backgroundColor: COLORS.WHITE_EASY,
});

type ContentResolverProps = {
  content: ContentSlide;
  playing: boolean;
};

const ContentResolver = React.memo(
  ({content, playing}: ContentResolverProps) => (
    <ContentWrapper>
      {content.type === 'facilitator' && <Facilitator />}
      {content.type === 'text' && (
        <TextContent content={content as TextContentType} />
      )}
      {content.type === 'video' && (
        <VideoContent content={content as VideoContentType} playing={playing} />
      )}
    </ContentWrapper>
  ),
);

const Fade: React.FC<{visible: boolean}> = ({children, visible}) => {
  const opacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {duration: 400});
  }, [opacity, visible]);

  return <AnimatedView style={animatedStyles}>{children}</AnimatedView>;
};

const Content: React.FC<ContentProps> = ({
  content,
  contentIndex = 0,
  playing,
}) => {
  const prevContent = contentIndex > 0 ? content[contentIndex - 1] : null;
  const currentContent = content[contentIndex];
  const nextContent =
    contentIndex < content.length - 1 ? content[contentIndex + 1] : null;

  return (
    <>
      <TopSafeArea />
      <Wrapper>
        {prevContent && (
          <Fade visible={false} key={contentIndex - 1}>
            <ContentResolver content={prevContent} playing={false} />
          </Fade>
        )}
        {nextContent && (
          <Fade visible={false} key={contentIndex + 1}>
            <ContentResolver content={nextContent} playing={false} />
          </Fade>
        )}
        <Fade visible={true} key={contentIndex}>
          <ContentResolver content={currentContent} playing={playing} />
        </Fade>
      </Wrapper>
    </>
  );
};

export default Content;
