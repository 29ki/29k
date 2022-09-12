import React from 'react';
import RNVideo from 'react-native-video';
import styled from 'styled-components/native';
import {
  ContentSlide,
  ReflectionSlide,
  SharingSlide,
} from '../../../../../../../shared/src/types/Content';
import Image from '../../../../../common/components/Image/Image';
import {Spacer12} from '../../../../../common/components/Spacers/Spacer';
import {H2} from '../../../../../common/components/Typography/Heading/Heading';

const Video = styled(RNVideo)({
  flex: 1,
});

const Heading = styled(H2)({
  textAlign: 'center',
});

const Content: React.FC<{
  slide: ReflectionSlide | SharingSlide | ContentSlide;
  playing: boolean;
}> = ({slide, playing}) => (
  <>
    {slide.content.heading && (
      <>
        <Spacer12 />
        <Heading>{slide.content.heading}</Heading>
        <Spacer12 />
      </>
    )}
    {slide.content.video ? (
      <Video
        source={{uri: slide.content.video.source}}
        paused={!playing}
        resizeMode="contain"
      />
    ) : slide.content.image ? (
      <Image source={{uri: slide.content.image.source}} />
    ) : null}
    <Spacer12 />
  </>
);

export default Content;
