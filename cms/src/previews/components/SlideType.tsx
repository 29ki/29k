import {ExerciseSlide} from '../../../../shared/src/types/Content';
import {SLIDES} from '../../fields/exercise';

type Props = {slide: ExerciseSlide};
const SlideType = ({slide}: Props) =>
  SLIDES.types?.find(type => type.name === slide.type)?.label;

export default SlideType;
