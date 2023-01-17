import React from 'react';
import styled from 'styled-components/native';

import {COLORS} from '../../../../../shared/src/constants/colors';
import {SPACINGS} from '../../constants/spacings';
import {Body12} from '../Typography/Body/Body';

const Container = styled.View({
  paddingHorizontal: SPACINGS.FOUR,
  paddingVertical: 2,
  borderRadius: SPACINGS.FOUR,
  backgroundColor: COLORS.PURE_WHITE,
  marginTop: SPACINGS.FOUR,
});

type TagProps = {
  children: React.ReactNode;
};

const Tag: React.FC<TagProps> = ({children}) => (
  <Container>
    <Body12>{children}</Body12>
  </Container>
);

export default Tag;
