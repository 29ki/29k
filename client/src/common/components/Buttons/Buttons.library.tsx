import React from 'react';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';
import {Spacer16} from '../Spacers/Spacer';

import Button from './Button';

export const AllButtons = () => (
  <ScreenWrapper>
    <Button>Regular button</Button>
    <Spacer16 />
    <Button primary>Primary button</Button>
  </ScreenWrapper>
);
