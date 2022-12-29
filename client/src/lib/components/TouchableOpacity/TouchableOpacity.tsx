import React from 'react';
import {
  TouchableOpacity as TrueComponent,
  TouchableOpacityProps,
} from 'react-native';

const TouchableOpacity: React.FC<TouchableOpacityProps> = ({
  children,
  ...props
}) => (
  <TrueComponent activeOpacity={0.7} {...props}>
    {children}
  </TrueComponent>
);

export default TouchableOpacity;
