import React from 'react';
import MarkdownDisplay, {MarkdownProps} from 'react-native-markdown-display';
import * as linking from '../../../linking/nativeLinks';
import rules from './rules';
import styles from './styles';

type MarkdownDisplayProps = MarkdownProps & {
  children: React.ReactNode;
};

const MarkdownDisplayTyped = MarkdownDisplay as React.FC<MarkdownDisplayProps>;

const onLinkPress = (url: string) => {
  linking.openURL(url);
  return false; // Do not fallback to default Linking.openURL
};

const Markdown: React.FC<{children: React.ReactNode}> = ({children}) => (
  <MarkdownDisplayTyped style={styles} rules={rules} onLinkPress={onLinkPress}>
    {children}
  </MarkdownDisplayTyped>
);

export default React.memo(Markdown);
