import React from 'react';
import {Button as RNButton} from 'react-native';

const Button: React.FC<{
  title: string;
  onPress: () => void;
}> = ({title, onPress}) => <RNButton title={title} onPress={onPress} />;

export default Button;
