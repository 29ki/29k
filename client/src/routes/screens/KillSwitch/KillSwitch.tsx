import React from 'react';
import {
  BottomSafeArea,
  TopSafeArea,
} from '../../../lib/components/Spacers/Spacer';
import KillSwitchMessage from '../../../lib/killSwitch/components/KillSwitchMessage';

const KillSwitch = () => (
  <>
    <TopSafeArea />
    <KillSwitchMessage />
    <BottomSafeArea />
  </>
);

export default KillSwitch;
