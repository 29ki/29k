import React, {Fragment} from 'react';
import {
  Spacer4,
  Spacer16,
} from '../../../../client/src/lib/components/Spacers/Spacer';
import {Heading16} from '../../../../client/src/lib/components/Typography/Heading/Heading';
import ContentSlide from '../../../../client/src/lib/session/components/Slides/Slide';
import HostNote from './HostNote';
import {MobileWidth, MobileView} from './MobileView';
import SlideType from './SlideType';
import {ExerciseSlide} from '../../../../shared/src/types/Content';

type Props = {
  slide: ExerciseSlide;
};
const Slide: React.FC<Props> = ({slide}) => (
  <MobileWidth>
    <Heading16>
      <SlideType slide={slide} />
    </Heading16>
    <Spacer4 />
    <MobileView>
      <ContentSlide slide={slide} active async web />
    </MobileView>
    <Spacer16 />
    {'hostNotes' in slide &&
      slide.hostNotes?.map((note, index) => (
        <Fragment key={index}>
          <HostNote>{note.text}</HostNote>
          <Spacer16 />
        </Fragment>
      ))}
    <Spacer16 />
  </MobileWidth>
);

export default Slide;
