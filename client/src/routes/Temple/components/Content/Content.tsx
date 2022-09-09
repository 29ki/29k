import React from 'react';
import styled from 'styled-components/native';

import {TopSafeArea} from '../../../../common/components/Spacers/Spacer';
import TextContent from './contentTypes/Text';
import VideoContent from './contentTypes/Video';

import {
  ContentSlide,
  TextContentType,
  VideoContentType,
} from '../../../../../../shared/src/types/Content';
import Facilitator from './contentTypes/Facilitator';
import FadeIn from '../../../../common/components/FadeIn/FadeIn';

type ContentProps = {
  content: ContentSlide[];
  contentIndex: number;
  playing: boolean;
};

const Wrapper = styled.View({
  flex: 1,
});

const Content: React.FC<ContentProps> = ({
  content,
  contentIndex = 0,
  playing,
}) => {
  return (
    <>
      <TopSafeArea />
      <Wrapper>
        {content[contentIndex].type === 'facilitator' && (
          <FadeIn>
            <Facilitator />
          </FadeIn>
        )}
        {content[contentIndex].type === 'text' && (
          <FadeIn>
            <TextContent content={content[contentIndex] as TextContentType} />
          </FadeIn>
        )}
        {content[contentIndex].type === 'video' && (
          <FadeIn>
            <VideoContent
              content={content[contentIndex] as VideoContentType}
              playing={playing}
            />
          </FadeIn>
        )}
      </Wrapper>
    </>
  );
};

export default Content;
