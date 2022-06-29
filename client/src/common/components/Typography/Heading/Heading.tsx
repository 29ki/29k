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
export const Heading1: React.FC<HeadingProps> = props => (
  <Heading {...props} defaultStyles={typeStyles.HEADING1} />
);
export const Heading2: React.FC<HeadingProps> = props => (
  <Heading {...props} defaultStyles={typeStyles.HEADING2} />
);
export const Heading3: React.FC<HeadingProps> = props => (
  <Heading {...props} defaultStyles={typeStyles.HEADING3} />
);
export const Heading4: React.FC<HeadingProps> = props => (
  <Heading {...props} defaultStyles={typeStyles.HEADING4} />
);
