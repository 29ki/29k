import React from 'react';
import styled from 'styled-components/native';

import {
  ExerciseSlidesContent,
  ExerciseSlidesReflection,
  ExerciseSlidesSharing,
} from '../../../../../../../shared/src/types/generated/Exercise';
import Heading from './Blocks/Heading';
import Image from '../../../../../common/components/Image/Image';
import Video from './Blocks/Video';
import {
  Spacer12,
  Spacer8,
} from '../../../../../common/components/Spacers/Spacer';
import Text from './Blocks/Text';

const GraphicsWrapper = styled.View({
  flex: 1,
});
const TextWrapper = styled.View({
  justifyContent: 'center',
  flex: 1,
});

type ContentProps = {
  slide:
    | ExerciseSlidesReflection
    | ExerciseSlidesSharing
    | ExerciseSlidesContent;
  active: boolean;
};
const Content: React.FC<ContentProps> = ({slide: {content}, active}) => (
  <>
    <Spacer12 />
    {!content.video && !content.image && (
      <TextWrapper>
        {content.heading && <Heading>{content.heading}</Heading>}
        {content.text && <Text>{content.text}</Text>}
      </TextWrapper>
    )}
    {(content.video || content.image) && content.heading && (
      <Heading>{content.heading}</Heading>
    )}
    {(content.video || content.image) && content.text && (
      <Text>{content.text}</Text>
    )}

    {content.video ? (
      <GraphicsWrapper>
        <Spacer8 />
        <Video
          source={{uri: content.video.source}}
          audioSource={
            content.video.audio ? {uri: content.video.audio} : undefined
          }
          active={active}
          preview={content.video.preview}
          autoPlayLoop={content.video.autoPlayLoop}
        />
      </GraphicsWrapper>
    ) : content.image ? (
      <GraphicsWrapper>
        <Spacer8 />
        <Image resizeMode="contain" source={{uri: content.image.source}} />
      </GraphicsWrapper>
    ) : null}
  </>
);

export default Content;
