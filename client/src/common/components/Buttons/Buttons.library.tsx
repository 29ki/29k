import React from 'react';

import ScreenWrapper from '../../../lib/uiLib/decorators/ScreenWrapper';

import Button from './Button';

export const AllButtons = () => (
  <ScreenWrapper>
    <Button onPress={() => undefined}>Dummy button</Button>
  </ScreenWrapper>
);
