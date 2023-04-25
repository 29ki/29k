import styled from 'styled-components/native';
import Gutters from '../../../../lib/components/Gutters/Gutters';
import {COLORS} from '../../../../../../shared/src/constants/colors';
import {Body14} from '../../../../lib/components/Typography/Body/Body';
import {BodyItalic} from '../../../../lib/components/Typography/Body/Body';
import React from 'react';

const Wrapper = styled(Gutters)({
  paddingVertical: 8,
  borderRadius: 8,
  backgroundColor: COLORS.PURE_WHITE,
});

type FeedbackCommentProps = {
  children: React.ReactNode;
};
const FeedbackComment: React.FC<FeedbackCommentProps> = ({children}) => (
  <Wrapper>
    <Body14>
      <BodyItalic>{children}</BodyItalic>
    </Body14>
  </Wrapper>
);

export default FeedbackComment;
