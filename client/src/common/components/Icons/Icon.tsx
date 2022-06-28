import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import Svg from 'react-native-svg';

const defaultStyles = StyleSheet.create({
  icon: {
    aspectRatio: 1,
  },
});

type IconProps = {
  styles?: StyleProp<ViewStyle>;
};

const Icon: React.FC<IconProps> = ({children, styles}) => (
  <Svg
    width="100%"
    height="100%"
    viewBox="0 0 30 30"
    style={[defaultStyles.icon, styles]}>
    {children}
  </Svg>
);

export default Icon;
