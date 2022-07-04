import React from 'react';
import MarkdownDisplay from 'react-native-markdown-display';
import rules from './rules';
import styles from './styles';

const Markdown: React.FC = ({children}) => (
  <MarkdownDisplay style={styles} rules={rules}>
    {children}
  </MarkdownDisplay>
);

export default Markdown;
