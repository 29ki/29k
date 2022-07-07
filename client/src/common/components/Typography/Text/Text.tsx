import React from 'react';
import {Text as RNText, TextStyle} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
type TextLinkProps = {
  styles?: {onPress: () => void};
  onPress: () => void;
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
export const TextLink: React.FC<TextLinkProps> = props => (
  <TouchableOpacity onPress={props.onPress}>
    <Text {...props} defaultStyles={typeStyles.TEXTLINK} />
  </TouchableOpacity>
);
