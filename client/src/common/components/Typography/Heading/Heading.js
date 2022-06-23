import React from 'react';
import {Text} from 'react-native';
import COLORS from '../../../constants/colors';

import styles from '../styles';

const Heading = ({style = {}, children, level = 1}) => (
  <Text
    allowFontScaling={false}
    style={[styles[`HEADING${level}`], {color: COLORS.GREY800}, style]}>
    {children}
  </Text>
);

export const Heading1 = props => <Heading {...props} level={1} />;
export const Heading2 = props => <Heading {...props} level={2} />;
export const Heading3 = props => <Heading {...props} level={3} />;
export const Heading4 = props => <Heading {...props} level={4} />;
