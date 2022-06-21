import React from 'react';
import {Text} from 'react-native';

import styles from '../styles';

const Heading = ({style = {}, children, level = 1}) => (
  <Text allowFontScaling={false} style={[styles[`HEADING${level}`], style]}>
    {children}
  </Text>
);

export const Heading1 = props => <Heading {...props} level={1} />;
