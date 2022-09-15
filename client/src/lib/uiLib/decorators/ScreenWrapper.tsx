import React from 'react';
import {ScrollView} from 'react-native';

import Gutters from '../../../common/components/Gutters/Gutters';
import {
  BottomSafeArea,
  TopSafeArea,
} from '../../../common/components/Spacers/Spacer';

const ScreenWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <ScrollView>
    <TopSafeArea />
    <Gutters>{children}</Gutters>
    <BottomSafeArea />
  </ScrollView>
);

export default ScreenWrapper;
