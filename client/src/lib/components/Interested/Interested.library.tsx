import React from 'react';
import ScreenWrapper from '../../uiLib/decorators/ScreenWrapper';
import {Spacer16} from '../Spacers/Spacer';
import {Heading16} from '../Typography/Heading/Heading';
import Interested from './Interested';

export const AllStates = () => (
  <ScreenWrapper>
    <Heading16>Count</Heading16>
    <Interested count={10} />
    <Spacer16 />

    <Heading16>Reminder and Count = 0</Heading16>
    <Interested reminder count={0} />
    <Spacer16 />

    <Heading16>Reminder and Count</Heading16>
    <Interested reminder count={1} />
    <Spacer16 />

    <Heading16>Reminder and Count compact</Heading16>
    <Interested reminder count={1} compact />
    <Spacer16 />
  </ScreenWrapper>
);
