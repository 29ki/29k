import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {MemoizedSpacer} from './Spacer';

export const TopSafeArea = ({minSize = 0}) => (
  <MemoizedSpacer size={Math.max(useSafeAreaInsets().top, minSize)} />
);
export const BottomSafeArea = ({minSize = 0}) => (
  <MemoizedSpacer size={Math.max(useSafeAreaInsets().bottom, minSize)} />
);
