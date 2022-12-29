import React from 'react';
import {ScrollView} from 'react-native';

import Gutters from '../../components/Gutters/Gutters';
import {BottomSafeArea, TopSafeArea} from '../../components/Spacers/Spacer';
import {GUTTERS} from '../../constants/spacings';

const ScreenWrapper: React.FC<{children: React.ReactNode}> = ({children}) => (
  <ScrollView>
    <TopSafeArea minSize={GUTTERS.BIG} />
    <Gutters>{children}</Gutters>
    <BottomSafeArea minSize={GUTTERS.BIG} />
  </ScrollView>
);

export default ScreenWrapper;
