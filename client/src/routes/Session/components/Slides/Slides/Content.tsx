import React, {useCallback, useMemo} from 'react';
import styled from 'styled-components/native';

import {
  ExerciseSlideContentSlide,
  ExerciseSlideReflectionSlide,
  ExerciseSlideSharingSlide,
} from '../../../../../../../shared/src/types/generated/Exercise';
import Heading from './Blocks/Heading';
import Image from '../../../../../common/components/Image/Image';
import Video from './Blocks/Video';
import {
  Spacer12,
  Spacer8,
} from '../../../../../common/components/Spacers/Spacer';
import Text from './Blocks/Text';
import useSessionState from '../../../state/state';
import useUpdateSessionExerciseState from '../../../hooks/useUpdateSessionExerciseState';

const GraphicsWrapper = styled.View({
  flex: 1,
});
const TextWrapper = styled.View({
  justifyContent: 'center',
  flex: 1,
});

const VideoWrapper = styled.View({
  flex: 1,
  aspectRatio: '1',
  alignSelf: 'center',
});

type ContentProps = {
  slide:
    | ExerciseSlideContentSlide
    | ExerciseSlideSharingSlide
    | ExerciseSlideReflectionSlide;
  active: boolean;
};
const Content: React.FC<ContentProps> = ({slide: {content = {}}, active}) => {
  const sessionId = useSessionState(state => state.session?.id);
  const {setPlaying} = useUpdateSessionExerciseState(sessionId);

  const videoSource = useMemo(
    () => ({uri: content?.video?.source}),
    [content.video?.source],
  );

  const audioSource = useMemo(
    () => (content?.video?.audio ? {uri: content.video.audio} : undefined),
    [content?.video?.audio],
  );

  const imageSource = useMemo(
    () => ({uri: content?.image?.source}),
    [content?.image?.source],
  );

  const resetCallback = useCallback(() => {
    setPlaying(false);
  }, [setPlaying]);

  return (
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
          <VideoWrapper>
            <Video
              source={videoSource}
              audioSource={audioSource}
              active={active}
              preview={content.video.preview}
              autoPlayLoop={content.video.autoPlayLoop}
              durationTimer={content.video.durationTimer}
              resetCallback={resetCallback}
            />
          </VideoWrapper>
        </GraphicsWrapper>
      ) : content.image ? (
        <GraphicsWrapper>
          <Spacer8 />
          <Image resizeMode="contain" source={imageSource} />
        </GraphicsWrapper>
      ) : null}
    </>
  );
};

export default Content;
