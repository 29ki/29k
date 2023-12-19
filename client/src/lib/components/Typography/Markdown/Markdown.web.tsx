import React, {Fragment} from 'react';
import RMarkdown, {Components} from 'react-markdown';
import {Spacer16} from '../../Spacers/Spacer';
import styles from './styles';
import {View, ViewStyle} from 'react-native';

const components: Components = {
  p: ({children}) => (
    <>
      <View style={styles.paragraph}>{children}</View>
      <Spacer16 />
    </>
  ),
};

type Props = {
  children: string;
  style: ViewStyle;
};
const Markdown = ({children}: Props) => (
  <RMarkdown components={components}>{children}</RMarkdown>
);

export default Markdown;
