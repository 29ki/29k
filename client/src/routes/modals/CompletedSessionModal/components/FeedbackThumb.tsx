import React from 'react';
import styled from 'styled-components/native';
import {
  ThumbsDownWithoutPadding,
  ThumbsUpWithoutPadding,
} from '../../../../lib/components/Thumbs/Thumbs';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import Svg, {Path, SvgProps} from 'react-native-svg';
import {Spacer4} from '../../../../lib/components/Spacers/Spacer';

const Container = styled.View({
  width: 22,
  alignItems: 'center',
  alignSelf: 'flex-end',
});

const ThumbsUp = styled(ThumbsUpWithoutPadding)({
  position: 'static',
  width: '100%',
  aspectRatio: 1,
});

const ThumbsDown = styled(ThumbsDownWithoutPadding)({
  position: 'static',
  width: '100%',
  aspectRatio: 1,
});

const Hook = (props: SvgProps) => (
  <Svg width={13} height={13} fill="none" {...props}>
    <Path
      fill={COLORS.PURE_WHITE}
      d="M13 13V2.633C13 .75 10.635-.089 9.448 1.372L0 13h13Z"
    />
  </Svg>
);

type FeedbackThumbProps = {
  answer: boolean;
};
const FeedbackThumb: React.FC<FeedbackThumbProps> = ({answer}) => (
  <Container>
    {answer ? <ThumbsUp /> : <ThumbsDown />}
    <Spacer4 />
    <Hook />
  </Container>
);

export default FeedbackThumb;
