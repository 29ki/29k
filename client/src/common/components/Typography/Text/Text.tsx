import React from 'react';
import {Text as RNText, TextStyle} from 'react-native';

import typeStyles from '../styles';

type TextBaseProps = {
  style?: {} & TextStyle;
  defaultStyles: TextStyle;
};
const Text: React.FC<TextBaseProps> = ({
  style = {},
  defaultStyles,
  children,
}) => <RNText style={[defaultStyles, style]}>{children}</RNText>;

type TextProps = {
  styles?: TextStyle;
};
export const B1: React.FC<TextProps> = props => (
  <Text {...props} defaultStyles={typeStyles.B1} />
);
export const B2: React.FC<TextProps> = props => (
  <Text {...props} defaultStyles={typeStyles.B2} />
);
export const B3: React.FC<TextProps> = props => (
  <Text {...props} defaultStyles={typeStyles.B3} />
);
