import React from 'react';
import {Text, TextStyle} from 'react-native';

import typeStyles from '../styles';

type HeadingBaseProps = {
  style?: {} & TextStyle;
  defaultStyles: TextStyle;
};
const Heading: React.FC<HeadingBaseProps> = ({
  style = {},
  defaultStyles,
  children,
}) => (
  <Text allowFontScaling={false} style={[defaultStyles, style]}>
    {children}
  </Text>
);

type HeadingProps = {
  style?: TextStyle;
};
export const H1: React.FC<HeadingProps> = props => (
  <Heading {...props} defaultStyles={typeStyles.H1} />
);
export const H2: React.FC<HeadingProps> = props => (
  <Heading {...props} defaultStyles={typeStyles.H2} />
);
export const H3: React.FC<HeadingProps> = props => (
  <Heading {...props} defaultStyles={typeStyles.H3} />
);
export const H4: React.FC<HeadingProps> = props => (
  <Heading {...props} defaultStyles={typeStyles.H4} />
);
export const H5: React.FC<HeadingProps> = props => (
  <Heading {...props} defaultStyles={typeStyles.H5} />
);
