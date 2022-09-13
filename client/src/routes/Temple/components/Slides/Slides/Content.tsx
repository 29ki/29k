import React from 'react';
import {
  ContentSlide,
  ReflectionSlide,
  SharingSlide,
} from '../../../../../../../shared/src/types/Content';
import Heading from './Blocks/Heading';
import Image from '../../../../../common/components/Image/Image';
import Video from './Blocks/Video';
import {Spacer12} from '../../../../../common/components/Spacers/Spacer';

type ContentProps = {
  slide: ReflectionSlide | SharingSlide | ContentSlide;
  active: boolean;
};
const Content: React.FC<ContentProps> = ({slide, active}) => (
  <>
    {slide.content.heading && <Heading>{slide.content.heading}</Heading>}
    {slide.content.video ? (
      <Video source={{uri: slide.content.video.source}} active={active} />
    ) : slide.content.image ? (
      <Image source={{uri: slide.content.image.source}} />
    ) : null}
    <Spacer12 />
  </>
);

export default Content;
