import React from 'react';
import styled from 'styled-components/native';
import TextContent from './contentTypes/Text';
import VideoContent from './contentTypes/Video';
import {
  ContentSlide,
  TextContentType,
  VideoContentType,
} from '../../../../../../shared/src/types/Content';
import Facilitator from './contentTypes/Facilitator';
import {COLORS} from '../../../../common/constants/colors';

const Wrapper = styled.View({
  flex: 1,
  backgroundColor: COLORS.WHITE_EASY,
});

type ContentProps = {
  content: ContentSlide;
  playing: boolean;
};

export const Content = React.memo(({content, playing}: ContentProps) => (
  <Wrapper>
    {content.type === 'facilitator' && <Facilitator />}
    {content.type === 'text' && (
      <TextContent content={content as TextContentType} />
    )}
    {content.type === 'video' && (
      <VideoContent content={content as VideoContentType} playing={playing} />
    )}
  </Wrapper>
));
