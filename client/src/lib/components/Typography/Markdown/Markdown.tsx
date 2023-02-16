import React from 'react';
import MarkdownDisplay, {MarkdownProps} from 'react-native-markdown-display';
import rules from './rules';
import styles from './styles';

type MarkdownDisplayProps = MarkdownProps & {
  children: React.ReactNode;
};

const MarkdownDisplayTyped = MarkdownDisplay as React.FC<MarkdownDisplayProps>;

const Markdown: React.FC<{children: React.ReactNode}> = ({children}) => (
  <MarkdownDisplayTyped style={styles} rules={rules}>
    {children}
  </MarkdownDisplayTyped>
);

export default React.memo(Markdown);
