import React from 'react';
import Markdown from '../../../../../common/components/Typography/Markdown/Markdown';
import Gutters from '../../../../../common/components/Gutters/Gutters';
import {Spacer12} from '../../../../../common/components/Spacers/Spacer';

export type TextContentType = {type: 'text'; content: {text: string}};

const TextContent: React.FC<{content: TextContentType}> = ({content}) => (
  <Gutters>
    <Spacer12 />
    <Markdown>{content.content.text}</Markdown>
    <Spacer12 />
  </Gutters>
);

export default TextContent;
