import React from 'react';
import styled from 'styled-components/native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

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

const AnimatedView = styled(Animated.View)(
  ({visible = false}: {visible: boolean}) => ({
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    opacity: visible ? 1 : 0,
  }),
);

const Hidden = styled.View({
  ...StyleSheet.absoluteFillObject,
  zIndex: 1,
  opacity: 0,
});

const ContentWrapper = styled.View({
  flex: 1,
  backgroundColor: COLORS.WHITE_EASY,
});

type ContentResolverProps = {
  content: ContentSlide;
  playing: boolean;
};

const ContentResolver = ({content, playing}: ContentResolverProps) => (
  <ContentWrapper>
    {content.type === 'facilitator' && <Facilitator />}
    {content.type === 'text' && (
      <TextContent content={content as TextContentType} />
    )}
    {content.type === 'video' && (
      <VideoContent content={content as VideoContentType} playing={playing} />
    )}
  </ContentWrapper>
);

const Animation = ({visible, children}) =>
  visible ? (
    <AnimatedView entering={FadeIn.duration(2000)}>{children}</AnimatedView>
  ) : (
    <Hidden>{children}</Hidden>
  );

const Content: React.FC<ContentProps> = ({
  content,
  contentIndex = 0,
  playing,
}) => {
  return (
    <>
      <TopSafeArea />
      <Wrapper>
        {content.map((currentContent, index) => {
          return (
            <Animation visible={contentIndex === index} key={index}>
              <ContentResolver content={currentContent} playing={playing} />
            </Animation>
          );
        })}
      </Wrapper>
    </>
  );
};

export default Content;
