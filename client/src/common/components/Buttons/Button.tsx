import React from 'react';
import {Button as RNButton} from 'react-native';

const Button: React.FC<{title: string}> = ({title}) => (
  <RNButton title={title} />
);

export default Button;
