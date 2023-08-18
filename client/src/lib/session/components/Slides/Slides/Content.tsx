import React, {useEffect, useMemo} from 'react';
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
import useAdjustVolume from '../../../hooks/useAdjustVolume';

const Wrapper = styled.View({
  flex: 1,
  alignItems: 'center',
});

const GraphicsWrapper = styled.View({
  flex: 1,
  justifyContent: 'space-between',
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
const Content: React.FC<ContentProps> = ({slide, active, async}) => {
  const adjustVolume = useAdjustVolume();

  const content = useMemo(() => {
    return slide.content ?? {};
  }, [slide.content]);

  useEffect(() => {
    if (active && !async && slide.type === 'content') {
      adjustVolume();
    }
  }, [active, async, adjustVolume, slide]);

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
    <Wrapper>
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
            subtitles={content.lottie.subtitles}
            autoPlayLoop={content.lottie.autoPlayLoop}
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
            subtitles={content.video.subtitles}
            preview={content.video.preview}
            autoPlayLoop={content.video.autoPlayLoop}
            isLive={!async}
          />
        </GraphicsWrapper>
      ) : content.image ? (
        <GraphicsWrapper>
          <Spacer8 />
          <Image resizeMode="contain" source={imageSource} />
        </GraphicsWrapper>
      ) : null}
    </Wrapper>
  );
};

export default React.memo(Content);
