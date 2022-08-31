import React from 'react';

import {BottomSafeArea} from '../../common/components/Spacers/Spacer';
import {SPACINGS} from '../../common/constants/spacings';
import DailyProvider from './DailyProvider';
import Session from './Session';

const Temple = () => {
  return (
    <>
      <DailyProvider>
        <Session />
      </DailyProvider>
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </>
  );
};

export default Temple;
