import React from 'react';
import styled from 'styled-components/native';
import Markdown from '../../../../client/src/lib/components/Typography/Markdown/Markdown';
import {COLORS} from '../../../../shared/src/constants/colors';
import Gutters from '../../../../client/src/lib/components/Gutters/Gutters';
import {Spacer16} from '../../../../client/src/lib/components/Spacers/Spacer';

const Container = styled(Gutters)({
  backgroundColor: COLORS.CREAM,
});

type Props = {
  children: React.ReactNode;
};
const HostNote: React.FC<Props> = ({children}) => (
  <Container>
    <Spacer16 />
    <Markdown>{children}</Markdown>
  </Container>
);

export default HostNote;
