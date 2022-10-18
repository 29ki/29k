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
const Content: React.FC<ContentProps> = ({slide, active}) => (
  <>
    <Spacer12 />
    {!slide.content.video && !slide.content.image && (
      <TextWrapper>
        {slide.content.heading && <Heading>{slide.content.heading}</Heading>}
        {slide.content.text && <Text>{slide.content.text}</Text>}
      </TextWrapper>
    )}
    {(slide.content.video || slide.content.image) && slide.content.heading && (
      <Heading>{slide.content.heading}</Heading>
    )}
    {(slide.content.video || slide.content.image) && slide.content.text && (
      <Text>{slide.content.text}</Text>
    )}

    {slide.content.video ? (
      <GraphicsWrapper>
        <Spacer8 />
        <Video
          source={{uri: slide.content.video.source}}
          active={active}
          preview={slide.content.video.preview}
        />
      </GraphicsWrapper>
    ) : slide.content.image ? (
      <GraphicsWrapper>
        <Spacer8 />
        <Image
          resizeMode="contain"
          source={{uri: slide.content.image.source}}
        />
      </GraphicsWrapper>
    ) : null}
  </>
);

export default Content;
