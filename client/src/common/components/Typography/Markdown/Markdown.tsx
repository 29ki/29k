import React from 'react';
import MarkdownDisplay from 'react-native-markdown-display';

const Markdown: React.FC = ({children}) => (
  <MarkdownDisplay>{children}</MarkdownDisplay>
);

export default Markdown;
