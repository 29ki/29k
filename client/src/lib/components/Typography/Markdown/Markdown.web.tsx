import React from 'react';
import {View} from 'react-native';
import RMarkdown, {Components} from 'react-markdown';
import {Spacer16} from '../../Spacers/Spacer';
import styles from './styles';

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
};
const Markdown = ({children}: Props) => (
  <RMarkdown components={components}>{children}</RMarkdown>
);

export default Markdown;
