import React from 'react';
import styled from 'styled-components/native';
import {COLORS} from '../../../../../shared/src/constants/colors';
import {BodyBold} from '../Typography/Body/Body';

const Container = styled.View({
  backgroundColor: COLORS.PRIMARY,
  paddingVertical: 2,
  paddingHorizontal: 6,
  borderRadius: 6,
});

const Text = styled(BodyBold)({
  color: COLORS.PURE_WHITE,
  fontSize: 14,
  lineHeight: 18,
});

type InterestedBadgeProps = {
  count: number;
};

const InterestedBadge: React.FC<InterestedBadgeProps> = ({count}) => (
  <Container>
    <Text>{count}</Text>
  </Container>
);

export default InterestedBadge;
