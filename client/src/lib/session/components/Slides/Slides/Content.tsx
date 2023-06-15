import React, {useMemo} from 'react';
import styled from 'styled-components/native';

import {
  ExerciseSlideContentSlide,
  ExerciseSlideReflectionSlide,
  ExerciseSlideSharingSlide,
} from '../../../../../../../shared/src/types/generated/Exercise';
import Heading from './Blocks/Heading';
import Image from '../../../../components/Image/Image';
import Video from './Blocks/Video';
import {Spacer12, Spacer8} from '../../../../components/Spacers/Spacer';
import SubHeading from './Blocks/SubHeading';
import Lottie from './Blocks/Lottie';

const Container = styled.View({
  flex: 1,
  alignItems: 'center',
});

const GraphicsWrapper = styled.View({
  flex: 1,
  justifyContent: 'flex-end',
});

const TextWrapper = styled.View({
  justifyContent: 'center',
  flex: 1,
});

type ContentProps = {
  slide:
    | ExerciseSlideContentSlide
    | ExerciseSlideSharingSlide
    | ExerciseSlideReflectionSlide;
  active: boolean;
  async?: boolean;
};
const Content: React.FC<ContentProps> = ({
  slide: {content = {}},
  active,
  async,
}) => {
  const imageSource = useMemo(
    () => ({uri: content?.image?.source}),
    [content?.image?.source],
  );

  const lottieSource = useMemo(
    () => ({uri: content?.lottie?.source ?? ''}),
    [content?.lottie?.source],
  );

  const lottieDuration = useMemo(
    () => content.lottie?.duration ?? 60,
    [content.lottie?.duration],
  );

  return (
    <Container>
      <Spacer12 />
      {!content.video && !content.image && !content.lottie && (
        <TextWrapper>
          {content.heading && <Heading>{content.heading}</Heading>}
          {content.text && <SubHeading>{content.text}</SubHeading>}
        </TextWrapper>
      )}
      {!async &&
        (content.video || content.image || content.lottie) &&
        content.heading && <Heading>{content.heading}</Heading>}
      {!async &&
        (content.video || content.image || content.lottie) &&
        content.text && <SubHeading>{content.text}</SubHeading>}

      {content.lottie ? (
        <GraphicsWrapper>
          <Spacer8 />
          <Lottie
            source={lottieSource}
            audioSource={content.lottie.audio}
            active={active}
            duration={lottieDuration}
            autoPlayLoop={content.lottie.autoPlayLoop}
            durationTimer={content.lottie.durationTimer}
            isLive={!async}
          />
          <Spacer8 />
        </GraphicsWrapper>
      ) : content.video ? (
        <GraphicsWrapper>
          <Spacer8 />
          <Video
            source={content.video.source}
            audioSource={content.video.audio}
            active={active}
            preview={content.video.preview}
            autoPlayLoop={content.video.autoPlayLoop}
            durationTimer={content.video.durationTimer}
            isLive={!async}
          />
        </GraphicsWrapper>
      ) : content.image ? (
        <GraphicsWrapper>
          <Spacer8 />
          <Image resizeMode="contain" source={imageSource} />
        </GraphicsWrapper>
      ) : null}
    </Container>
  );
};

export default React.memo(Content);
