import React from 'react';
import {ScrollView} from 'react-native';

import Gutters from '../../../common/components/Gutters/Gutters';
import {
  BottomSafeArea,
  TopSafeArea,
} from '../../../common/components/Spacers/Spacer';
import {GUTTERS} from '../../../common/constants/spacings';

const ScreenWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <ScrollView>
    <TopSafeArea minSize={GUTTERS.BIG} />
    <Gutters>{children}</Gutters>
    <BottomSafeArea minSize={GUTTERS.BIG} />
  </ScrollView>
);

export default ScreenWrapper;
