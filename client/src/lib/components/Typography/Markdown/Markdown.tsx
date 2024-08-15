import {mergeDeepRight} from 'ramda';
import React, {useMemo} from 'react';
import MarkdownDisplay, {MarkdownProps} from 'react-native-markdown-display';
import * as linking from '../../../linking/nativeLinks';
import baseRules from './rules';
import baseStyles from './styles';

const onLinkPress = (url: string) => {
  linking.openURL(url);
  return false; // Do not fallback to default Linking.openURL
};

type Props = {
  styles?: MarkdownProps['style'];
  children: React.ReactNode;
};
const Markdown: React.FC<Props> = ({children, styles = {}}) => {
  const mergedStyles = useMemo(
    () => mergeDeepRight(baseStyles, styles),
    [styles],
  );
  return (
    <MarkdownDisplay
      style={mergedStyles}
      rules={baseRules}
      onLinkPress={onLinkPress}>
      {children}
    </MarkdownDisplay>
  );
};

export default React.memo(Markdown);
