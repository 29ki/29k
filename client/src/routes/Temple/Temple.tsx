import React from 'react';

import {BottomSafeArea} from '../../common/components/Spacers/Spacer';
import {SPACINGS} from '../../common/constants/spacings';
import Session from './Session';

const Temple = () => {
  return (
    <>
      <Session />
      <BottomSafeArea minSize={SPACINGS.SIXTEEN} />
    </>
  );
};

export default Temple;
