import React from 'react';
import {ScrollView} from 'react-native';
import {Display36} from '../Typography/Display/Display';
import Screen from './Screen';

const ShortContent = () => (
  <Display36>
    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
    Lorem Ipsum has been the industry's standard dummy text ever since the
    1500s.
  </Display36>
);

const LongContent = () => (
  <ScrollView>
    <ShortContent />
    <ShortContent />
    <ShortContent />
    <ShortContent />
    <ShortContent />
    <ShortContent />
    <ShortContent />
    <ShortContent />
  </ScrollView>
);

export const Default = () => (
  <Screen>
    <ShortContent />
  </Screen>
);

export const BackgroundColor = () => (
  <Screen backgroundColor="#FF0000">
    <LongContent />
  </Screen>
);

export const BackButton = () => (
  <Screen onPressBack={() => {}} onPressClose={() => {}}>
    <LongContent />
  </Screen>
);

export const CloseButton = () => (
  <Screen onPressClose={() => {}}>
    <LongContent />
  </Screen>
);

export const EllipsisButton = () => (
  <Screen onPressEllipsis={() => {}}>
    <LongContent />
  </Screen>
);

export const BackEllipsisAndCloseButton = () => (
  <Screen
    onPressBack={() => {}}
    onPressClose={() => {}}
    onPressEllipsis={() => {}}>
    <LongContent />
  </Screen>
);
