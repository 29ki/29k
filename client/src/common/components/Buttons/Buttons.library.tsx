import React from 'react';
import {StyleSheet} from 'react-native';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';

import Button from './Button';
import IconButton from './IconButton/IconButton';
import {HomeIcon} from '../Icons/Home/Home';

export const AllButtons = () => (
  <ScreenWrapper>
    <Button onPress={() => undefined}>Dummy button</Button>
    <IconButton Icon={HomeIcon} fill="black" />
  </ScreenWrapper>
);

export const Buttons = () => (
  <ScreenWrapper>
    <Button onPress={() => undefined}>Dummy button</Button>
  </ScreenWrapper>
);

const IconWithBackgroundStyle = StyleSheet.create({
  image: {backgroundColor: 'black'},
});
export const IconButtons = () => (
  <ScreenWrapper>
    <IconButton Icon={HomeIcon} fill="black" />
    <IconButton
      Icon={HomeIcon}
      fill="white"
      style={IconWithBackgroundStyle.image}
    />
  </ScreenWrapper>
);
