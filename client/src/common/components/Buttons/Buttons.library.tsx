import React from 'react';

import ScreenWrapper from '../../../uiLib/decorators/ScreenWrapper';

import Button from './Button';

export const AllButtons = () => (
  <ScreenWrapper>
    <Button onPress={() => undefined} title="Dummy button" />
  </ScreenWrapper>
);
