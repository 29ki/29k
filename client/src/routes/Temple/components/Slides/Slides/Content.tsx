import React from 'react';
import styled from 'styled-components/native';
import {
  ContentSlide,
  ReflectionSlide,
  SharingSlide,
} from '../../../../../../../shared/src/types/Content';
import Image from '../../../../../common/components/Image/Image';
import {Spacer12} from '../../../../../common/components/Spacers/Spacer';
import {H2} from '../../../../../common/components/Typography/Heading/Heading';
import Video from './Blocks/Video';

const Heading = styled(H2)({
  textAlign: 'center',
});

type ContentProps = {
  slide: ReflectionSlide | SharingSlide | ContentSlide;
  active: boolean;
};
const Content: React.FC<ContentProps> = ({slide, active}) => (
  <>
    {slide.content.heading && (
      <>
        <Spacer12 />
        <Heading>{slide.content.heading}</Heading>
        <Spacer12 />
      </>
    )}
    {slide.content.video ? (
      <Video source={{uri: slide.content.video.source}} active={active} />
    ) : slide.content.image ? (
      <Image source={{uri: slide.content.image.source}} />
    ) : null}
    <Spacer12 />
  </>
);

export default Content;
