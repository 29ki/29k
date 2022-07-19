import React from 'react';
import {ColorValue} from 'react-native';

export type IconType = React.FC<{
  fill?: ColorValue;
}>;

export * from './Back/Back';
export * from './Forward/Forward';
export * from './Home/Home';
export * from './Logo/Logo';
export * from './Profile/Profile';
