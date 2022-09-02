import React from 'react';
import styled from 'styled-components/native';
import Gutters from '../../../../../common/components/Gutters/Gutters';
import {Spacer12} from '../../../../../common/components/Spacers/Spacer';
import {H2} from '../../../../../common/components/Typography/Heading/Heading';

export type TextContentType = {
  type: 'text';
  content: {
    heading: string;
  };
};

const Heading = styled(H2)({
  textAlign: 'center',
});

const TextContent: React.FC<{content: TextContentType}> = ({content}) => (
  <Gutters>
    <Spacer12 />
    <Heading>{content.content.heading}</Heading>
    <Spacer12 />
  </Gutters>
);

export default TextContent;
