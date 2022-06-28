import React from 'react';
import {StyleSheet, Text, TextStyle} from 'react-native';
import {COLORS} from '../../../constants/colors';

import typeStyles from '../styles';

const styles = StyleSheet.create({
  heading: {
    ...typeStyles[`HEADING${level}`],
    color: COLORS.GREY800,
  },
});

type HeadingProps = {style: {} & TextStyle};
const Heading: React.FC<HeadingProps> = ({style = {}, children}) => (
  <Text allowFontScaling={false} style={[styles.heading, style]}>
    {children}
  </Text>
);

export const Heading1 = props => <Heading {...props} level={1} />;
export const Heading2 = props => <Heading {...props} level={2} />;
export const Heading3 = props => <Heading {...props} level={3} />;
export const Heading4 = props => <Heading {...props} level={4} />;
